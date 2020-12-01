import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, switchMap, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Participant, HasId } from '../participants/participant.model';
import { Stage } from '../stage/stage.model';

@Component({
  selector: 'app-admin-results-form',
  template: `
  <table *ngIf="stage$ | async as stage">
  <colgroup>
    <col span="2">
    <col style="background-color:yellow">
    <ng-container *ngFor="let tasks of stageTasks$ | async; let i = index ">
      <col span="7" [ngStyle]="{'background-color': (i+1) % 2? 'lightgrey' : 'lightblue'}">
    </ng-container>
    
  </colgroup>
  <tr>
    <th>Cancelled</th>
    <th>Reg.Nr.</th>
    <th>Vārds</th>

    <ng-container *ngFor="let tasks of stageTasks$ | async">
      <th>Score</th>
      <th>Distance</th>
      <th>Speed</th>
      <th>MaxHeight</th>
      <th>Start</th>
      <th>Finish</th>
      <th>Penalty %</th>
    </ng-container>
    <th>Score</th>
  </tr>
  <tr *ngFor="let p of participantList$ | async; let i = index; trackBy: trackById"
    app-participant-row
    [participant]="p"
    [taskCount]="stage.taskCount">
  </tr>
  </table>
  `,
  styleUrls: ['./admin-results-form.component.scss']
})
export class AdminResultsFormComponent implements OnInit {

  yearAndStageId$ = (this.activatedRoute.parent!.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.id === b.id && a.year === b.year),
  );

  stage$ = this.yearAndStageId$.pipe(
    switchMap(({ year, id }) =>
      this.afs.doc<Stage>(`years/${year}/stages/${id}`).valueChanges().pipe(
        filter((s): s is Stage => s !== undefined),
        map(s => ({ ...s, id }))
      )
    )
  );
  stageTasks$ = this.stage$.pipe(map(stage => Array(stage.tasksCount).fill(0)))

  participantList$: Observable<Array<Participant & HasId>> = this.yearAndStageId$.pipe(
    switchMap(({ id, year }) => this.afs.collection<Participant>(`years/${year}/stages/${id}/participants`).valueChanges({ idField: 'id' }))
  );
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore) { }

  async ngOnInit() {
    this.stageCount = (await this.stage$.toPromise()).tasksCount;
    this.stageIterator = Array(this.stageCount).fill(0).map((x,i)=>i);
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }

}
