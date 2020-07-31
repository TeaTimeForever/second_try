import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Participant, HasId } from '../participants/participant.model';

@Component({
  selector: 'app-admin-results-form',
  template: `
  <table>
  <tr>
    <th>Cancelled</th>
    <th>Reg.Nr.</th>
    <th>Vārds</th>
    <th>Score</th>
    <th>Distance</th>
    <th>Speed</th>
    <th>MaxHeight</th>
    <th>Start</th>
    <th>Finish</th>
    <th>Penalty %</th>
    <th>Score</th>
  </tr>
  <tr *ngFor="let p of participantList$ | async; let i = index; trackBy: trackById"
    app-participant-row
    [participant]="p"
    [taskCount]="2">
  </tr>
  </table>
  `,
  styleUrls: ['./admin-results-form.component.scss']
})
export class AdminResultsFormComponent implements OnInit {

  yearAndStageId$ = (this.activatedRoute.parent!.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.id === b.id && a.year === b.year),
  );
  participantList$: Observable<Array<Participant & HasId>> = this.yearAndStageId$.pipe(
    switchMap(({ id, year }) => this.afs.collection<Participant>(`years/${year}/stages/${id}/participants`).valueChanges({ idField: 'id' }))
  );
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore) { }
  ngOnInit() {
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }

}
