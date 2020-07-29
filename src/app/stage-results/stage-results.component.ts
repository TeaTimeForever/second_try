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
<app-result-table title="Open KLASE" [participants$]="userList$" class="openClass"></app-result-table>
<app-result-table title="Standarta KLASE" [participants$]="standartScores$" class="standardClass"></app-result-table>
<app-result-table title="Sieviešu ieskaite" [participants$]="womenScores$" class="womenClass"></app-result-table>
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
  standartScores$ = this.userList$.pipe(map((users) => users.filter(u => u.wingClass === 'B' || u.wingClass === 'A')))

  ngOnInit() {
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }

}
