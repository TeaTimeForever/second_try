import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant, HasId } from '../participants/participant.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-result-table',
  template: `

  <h2>{{title}}</h2>
  <table class="results "  cellspacing="0" cellpadding="0">
  <thead>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <ng-container *ngFor="let taskIndex of tasksIds;">
    <th colspan="3">{{taskIndex+1}}. uzdevums</th>
  </ng-container>

  <th>Kopvērtējums</th>
</thead>
<tr>
  <th>Vieta</th>
  <th>Reģ. Nr.</th>
  <th>Vārds</th>
  <th>Spārna klase</th>

  <ng-container *ngFor="let taskIndex of tasksIds;">
    <th>Punkti</th>
    <th>Distance (km)</th>
    <th>Ātrums (km/h)</th>
  </ng-container>

  <th>Punkti</th>

</tr>
    <tr *ngFor="let p of participants$ | async; let i = index; trackBy: trackById">
    <td>{{i+1}}.</td>
    <td>{{p.registrationNumber}}</td>
    <td>{{p.name}} {{p.surname}}</td>
    <td>{{p.wingClass | uppercase}}</td>

    <ng-container *ngFor="let taskIndex of tasksIds;">
      <td>{{p.tasks[taskIndex].score}} {{p.tasks[0].penalty? '*' : ''}}</td>
      <td>{{p.tasks[taskIndex].distance}}</td>
      <td>{{p.tasks[taskIndex].speed}}</td>
    </ng-container>

    <td>{{p.score}}</td >
    </tr>
  </table>
  <span class="penalty-description" *ngIf="penaltyNoteIsVisible$ | async">
    <b>*</b> 50% sods saskaņā ar nolikuma 11.4 punktu
  </span>
  `,
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {

  @Input() title?: string;
  @Input() color?: string;
  @Input() participants$?: Observable<Array<Participant & HasId>>;
  @Input() tasksIds = [0, 1]; // TODO: Should be provided
  penaltyNoteIsVisible$?: Observable<boolean>;
  
  constructor() { }

  ngOnInit() {
    this.penaltyNoteIsVisible$ = this.participants$!.pipe(
      map(participants => !!participants.find(p => !!p.tasks!.find(t => !!t.penalty))),
      startWith(false));
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }
}
