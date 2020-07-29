import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant, HasId } from '../participants/participant.model';

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
    <tr *ngFor="let p of participants$ | async; let i = index; trackBy: trackById">
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
  `,
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {

  @Input() title?: string;
  @Input() color?: string;
  @Input() participants$?: Observable<Array<Participant & HasId>>;
  constructor() { }

  ngOnInit() {
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }
}
