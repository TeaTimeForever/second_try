import { Component, OnInit } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { Participant, HasId } from '../participants/participant.model';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService, UserPublicData } from '../user.service';
import { distinctUntilChanged, switchMap, first, map, filter } from 'rxjs/operators';
import { fill } from 'lodash-es';
import { ParticipantsComponent } from '../participants/participants.component';

@Component({
  selector: 'app-stage-results',
  template: `
<div class="openClass">
  <h2>Open KLASE</h2>
  <table class="results "  cellspacing="0" cellpadding="0">
    <tr>
      <th>Vieta</th>
      <th>Reģ. Nr.</th>
      <th>Vārds</th>
      <th>Spārna klase</th>
      <th>Punkti</th>
      <th>Distance</th>
      <th>Max. Augstums</th>
      <th>Starts SS</th>
  
    </tr>
    <tr *ngFor="let p of userList$ | async; let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass}}</td>
    <td>{{p.score}}</td>
    <td>{{p.distance}}</td>
    <td>{{p.maxHeight}}</td>
    <td>{{p.start}}</td>
    </tr>
  </table>
</div>
<div class="standardClass">
<h2>Standarta KLASE</h2>
  <table class="results"  cellspacing="0" cellpadding="0">
    <tr>
      <th>Vieta</th>
      <th>Reģ. Nr.</th>
      <th>Vārds</th>
      <th>Spārna klase</th>
      <th>Punkti</th>
      <th>Distance</th>
      <th>Max. Augstums</th>
      <th>Starts SS</th>
  
    </tr>
    <tr *ngFor="let p of standartScores$ | async; let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass}}</td>
    <td>{{p.score}}</td>
    <td>{{p.distance}}</td>
    <td>{{p.maxHeight}}</td>
    <td>{{p.start}}</td>
    </tr>
  </table>
</div>
<div class="womenClass">
  <h2>Sieviešu ieskaite</h2>
  <table class="results" cellspacing="0" cellpadding="0">
    <tr>
      <th>Vieta</th>
      <th>Reģ. Nr.</th>
      <th>Vārds</th>
      <th>Spārna klase</th>
      <th>Punkti</th>
      <th>Distance</th>
      <th>Max. Augstums</th>
      <th>Starts SS</th>
  
    </tr>
    <tr *ngFor="let p of womenScores$ | async;  let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass}}</td>
    <td>{{p.score}}</td>
    <td>{{p.distance}}</td>
    <td>{{p.maxHeight}}</td>
    <td>{{p.start}}</td>
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
    private activatedRoute: ActivatedRoute
  ) { }

  yearAndStageId$ = (this.activatedRoute.parent!.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.id === b.id && a.year === b.year),
  );

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

}
