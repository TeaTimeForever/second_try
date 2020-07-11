import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, pluck, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { StageService } from '../stage.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { stages } from '../stages.mock';
import { environment } from 'src/environments/environment';
import { GoogleMap } from '@googlemaps/map-loader';
import { Stage } from './stage.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

const mapLoader = new GoogleMap();

@Component({
  selector: 'app-stage',
  template: `
<div class="ml-3 stage-content" >


  <div class="description container center">
    <div class="infos">
      <a routerLink="./">info</a> 
      <a [routerLink]="['participants']">participants</a>
    </div>
    <h1>{{title | async}}</h1>
    <router-outlet style="display: none"></router-outlet>
    <div *ngIf="!isParticipantVisible">
      <div class="text-container" [innerHtml]="description | async"> </div>
  
      <div class="details">
        <div id="google_map"></div>
        <div class="useful">
          <div>Cena: {{stage.price}}</div>
          <div>Datums: {{stage.date}}</div>
          <div>Vieta: {{stage.place}}</div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit, OnDestroy {
  private stage$ = this.activeRoute.params.pipe(
    distinctUntilChanged((a, b) => a.year === b.year && a.id === b.id),
    switchMap(({ year, id }) => this.afs.doc(`years/${year}/stages/${id}`).valueChanges())
  )

  constructor(private activeRoute: ActivatedRoute,
    private stageService: StageService,
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer) { }

  isParticipantVisible = false;
  id?: string;
  description?: Promise<SafeHtml>;
  title?: Promise<string>;
  stage?: Stage;

  map?: google.maps.Map

  async initMap() {
    const mapOptions = {
      center: {
        lat: 56.649196,
        lng: 25.350384
      },
      zoom: 8
    }

    const apiOptions = {
      version: 'weekly',
      libraries: ['places']
    }

    const mapLoaderOptions = {
      apiKey: environment.googlemap,
      divId: 'google_map',
      append: false, // Appends to divId. Set to false to init in divId.
      mapOptions: mapOptions,
      apiOptions: apiOptions
    };

    // Load the map
    const googleMap = await mapLoader.initMap(mapLoaderOptions);

    new google.maps.Marker({
      map: googleMap,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: mapOptions.center
    });
  }
  async ngOnInit() {
    const pathParams = this.activeRoute.snapshot.params;
    this.id = (Object.keys(pathParams).length) ? pathParams.id : '1';
    const stagePost = this.stageService.getStageDescription(this.id!);

    this.description = stagePost
      .then(res => res.html)
      .then(res => this.sanitizer.bypassSecurityTrustHtml(res!));

    this.title = stagePost
      .then(res => res.title!)

    this.stage = stages[0];
    await this.initMap()
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.unbindAll()
    }
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

}
