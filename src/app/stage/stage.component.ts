import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, distinctUntilChanged, filter, share, pluck, takeUntil, first } from 'rxjs/operators';
import { StageService } from '../stage.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { GoogleMap } from '@googlemaps/map-loader';
import { Stage } from './stage.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { MapLoaderOptions } from '@googlemaps/map-loader/dist/map-loader';

const mapLoader = new GoogleMap();
const mapLoaderOptions: MapLoaderOptions = {
  apiKey: environment.googlemap,
  divId: 'google_map',
  append: false, // Appends to divId. Set to false to init in divId.
  mapOptions: {
    center: {
      lat: 56.649196,
      lng: 25.350384
    },
    zoom: 8
  },
  apiOptions: {
    version: 'weekly',
    libraries: ['places']
  }
};

@Component({
  selector: 'app-stage',
  template: `
<div class="stage-content" >
  <nav class="nav stages">
  <li *ngFor="let stage of stages$ | async">
    <a [ngClass]="{blink: stage.status === 'ongoing',
                   disabled: stage.status === 'announced',
                   cancelled: stage.status === 'cancelled'
                  }"
       routerLinkActive="active-link"
       [routerLink]="['/stage', year, stage.id]">{{stage.nr}}. posms</a>
  </li>
  </nav>
  <div class="container center" *ngIf="stage$ | async as stage">
    <div class="links">
      <a routerLink="./"
         routerLinkActive="active-link"
         [routerLinkActiveOptions]="{exact:true  }">#info</a> 
      <a routerLink="participants" routerLinkActive="active-link" *ngIf="stage.status !=='cancelled'" >#dalībnieki</a>
      <a routerLink="results" routerLinkActive="active-link" *ngIf="stage.status ==='finished'" >#rezultāti</a>
      <div *ngIf="stage.status ==='ongoing'" class="registration" routerLink="participants">Notiek reģistrācija</div>
      <div *ngIf="stage.status ==='cancelled'" class="cancelled">Atcelts</div>
    </div>
    
    <router-outlet style="display: none"></router-outlet>
    <div [ngClass]="{hidden: areParticipantsOpen}">
      <h2>{{title$ | async}}</h2>
      <div class="post" [innerHtml]="description$ | async"></div>
      <div class="details" [ngClass]="{hidden: stage.status ==='cancelled'}">
        <div id="google_map"></div>
          <table class="info">
            <tr>
              <td class="part">Dalības maksa</td>
              <td>{{stage.fee}}</td>
            </tr>
            <tr>
              <td class="part">Par retrīvu</td>
              <td>{{stage.retrieve}}</td>
            </tr>
            <tr>
              <td class="part">Datums</td>
              <td>2020 g. 18., 19. jūlijs </td>
            </tr>
            <tr>
              <td class="part">Vieta</td>
              <td>{{stage.place}}</td>
            </tr>
          </table>
      </div>
    </div>
  </div>
</div>
  `,
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit, OnDestroy {
  yearAndStageId$ = (this.activeRoute.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.year === b.year && a.id === b.id)
  );
  year = new Date().getFullYear();
  stages$ = this.afs.collection<Stage>(`years/${this.year}/stages`, q => q.orderBy('nr', 'asc')).valueChanges({ idField: 'id' })
  stage$ = this.yearAndStageId$.pipe(
    switchMap(({ year, id }) =>
      this.afs.doc<Stage>(`years/${year}/stages/${id}`).valueChanges().pipe(
        filter((s): s is Stage => s !== undefined),
        map(s => ({ ...s, id }))
      )
    )
  );

  private stagePost$ = this.stage$.pipe(
    switchMap(stage => this.stageService.getStageDescription(stage.id)),
    share()
  );

  description$ = this.stagePost$.pipe(
    pluck('html'),
    map(html => this.sanitizer.bypassSecurityTrustHtml(html!))
  );

  title$ = this.stagePost$.pipe(pluck('title'));

  constructor(private activeRoute: ActivatedRoute,
    private stageService: StageService,
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer) { }

  id?: string;
  description?: Promise<SafeHtml>;
  title?: Promise<string>;
  stage?: Stage;

  map = this.stage$.pipe(first()).toPromise().then(() => mapLoader.initMap(mapLoaderOptions))
  marker = this.stage$.pipe(first()).toPromise().then(() => this.map.then(map => new google.maps.Marker({
    map,
    draggable: false,
    animation: google.maps.Animation.DROP
  }))
  )

  unsubscribe$ = new Subject<void>()

  ngOnInit() {
    combineLatest(
      this.stage$, this.map, this.marker
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(([{ location: { latitude, longitude } }, map, marker]) => {
      // Whenever stage location changes - pan map to it, and update marker position
      const latLng: google.maps.LatLngLiteral = { lat: latitude, lng: longitude }
      map.panTo(latLng);
      marker.setPosition(latLng);
      marker.setAnimation(google.maps.Animation.DROP);
    });
  }

  ngOnDestroy() {
    this.map.then(map => {
      map.unbindAll();
    });
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  formatDate(date: firestore.Timestamp): string {
    const jsDate = date.toDate();
    return jsDate.toLocaleString('lv-LV', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get areParticipantsOpen() {
    return this.activeRoute.children.length > 0;
  }
}
