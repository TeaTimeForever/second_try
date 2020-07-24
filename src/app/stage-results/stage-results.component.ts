import { Component, OnInit } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { Participant, HasId } from '../participants/participant.model';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserService, UserPublicData } from '../user.service';
import { distinctUntilChanged, switchMap, first, map } from 'rxjs/operators';

@Component({
  selector: 'app-stage-results',
  template: `

<a target="_blank" [href]="linkToResults$ | async">Rezultāti [pdf]</a>
<div class="openClass">
  <h2>Open KLASE</h2>
  <table class="results "  cellspacing="0" cellpadding="0">
  <thead>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th colspan="3">1. uzdevums</th>
  <th colspan="3">2. uzdevums</th>
  <th>Kopvērtējums</th>
</thead>
<tr>
  <th>Vieta</th>
  <th>Reģ. Nr.</th>
  <th>Vārds</th>
  <th>Spārna klase</th>

  <th>Punkti</th>
  <th>Distance (km)</th>
  <th>Ātrums (km/h)</th>

  <th>Punkti</th>
  <th>Distance (km)</th>
  <th>Ātrums (km/h)</th>

  <th>Punkti</th>

</tr>
    <tr *ngFor="let p of userList$ | async; let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass | uppercase}}</td>

    <td>{{p.tasks[0].score}} {{p.tasks[0].penalty? '*' : ''}}</td>
    <td>{{p.tasks[0].distance}}</td>
    <td>{{p.tasks[0].speed}}</td>

    <td>{{p.tasks[1].score}}</td>
    <td>{{p.tasks[1].distance}}</td>
    <td>{{p.tasks[1].speed}}</td>
    <td>{{p.score}}</td>
    </tr>
  </table>
  <span class="penalty-description"><b>*</b> 50% sods saskaņā ar nolikuma 11.4 punktu</span>
</div>
<div class="standardClass">
<h2>Standarta KLASE</h2>
  <table class="results"  cellspacing="0" cellpadding="0">
    <thead>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th colspan="3">1. uzdevums</th>
      <th colspan="3">2. uzdevums</th>
      <th>Kopvērtējums</th>
    </thead>
    <tr>
      <th>Vieta</th>
      <th>Reģ. Nr.</th>
      <th>Vārds</th>
      <th>Spārna klase</th>

      <th>Punkti</th>
      <th>Distance (km)</th>
      <th>Ātrums (km/h)</th>

      <th>Punkti</th>
      <th>Distance (km)</th>
      <th>Ātrums (km/h)</th>

      <th>Punkti</th>
  
    </tr>
    <tr *ngFor="let p of standartScores$ | async; let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass | uppercase}}</td>

    <td>{{p.tasks[0].score}}</td>
    <td>{{p.tasks[0].distance}}</td>
    <td>{{p.tasks[0].speed}}</td>

    <td>{{p.tasks[1].score}}</td>
    <td>{{p.tasks[1].distance}}</td>
    <td>{{p.tasks[1].speed}}</td>
    <td>{{p.score}}</td>
    </tr>
  </table>
</div>
<div class="womenClass">
  <h2>Sieviešu ieskaite</h2>
  <table class="results" cellspacing="0" cellpadding="0">
  <thead>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th colspan="3">1. uzdevums</th>
    <th colspan="3">2. uzdevums</th>
    <th>Kopvērtējums</th>
  </thead>
  <tr>
    <th>Vieta</th>
    <th>Reģ. Nr.</th>
    <th>Vārds</th>
    <th>Spārna klase</th>
  
    <th>Punkti</th>
    <th>Distance (km)</th>
    <th>Ātrums (km/h)</th>
  
    <th>Punkti</th>
    <th>Distance (km)</th>
    <th>Ātrums (km/h)</th>
  
    <th>Punkti</th>
  
  </tr>
    <tr *ngFor="let p of womenScores$ | async;  let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass | uppercase}}</td>

    <td>{{p.tasks[0].score}}</td>
    <td>{{p.tasks[0].distance}}</td>
    <td>{{p.tasks[0].speed}}</td>

    <td>{{p.tasks[1].score}}</td>
    <td>{{p.tasks[1].distance}}</td>
    <td>{{p.tasks[1].speed}}</td>
    <td>{{p.score}}</td>
    </tr>
  </table>
</div>
  `,
  styleUrls: ['./stage-results.component.scss']
})
export class StageResultsComponent implements OnInit {

  constructor(
    public userService: UserService,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) { }

  
  yearAndStageId$ = (this.activatedRoute.parent!.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.id === b.id && a.year === b.year),
    );
    
  linkToResults$ = this.yearAndStageId$.pipe(switchMap(({ id, year }) => this.storage.storage.ref(`results/Results_${year}_XC${id}_.pdf`).getDownloadURL()));

  participantList$: Observable<Array<Participant & HasId>> = this.yearAndStageId$.pipe(
    switchMap(({ id, year }) => this.afs.collection<Participant>(`years/${year}/stages/${id}/participants`, ref => ref.orderBy('score', 'desc')).valueChanges({ idField: 'id' })),
  )

  userList$ = this.participantList$.pipe(
    switchMap(allParticipants => {
      return zip(...allParticipants.map(participant => 
        this.afs.doc<UserPublicData>(`users/${participant.id}`).valueChanges().pipe(
          first(),
          map((userData) => ({...participant, ...userData!}))))
        )
    })
  );

  womenScores$ = this.userList$.pipe(map((users) => users.filter(u => u.gender === 'F')))
  standartScores$ = this.userList$.pipe(map((users) => users.filter(u => u.wingClass === 'B')))

  ngOnInit() {
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }

}
