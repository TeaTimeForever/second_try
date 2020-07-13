import { Component, OnInit } from '@angular/core';
import {participants} from '../participants.mock';

@Component({
  selector: 'app-participants',
  template: `

  <router-outlet (activate)="participantFormVisible=true"
                 (deactivate)="participantFormVisible=false"
                 style="display: none"></router-outlet>
  <div class="content" *ngIf="!participantFormVisible">
  <div>
    <table class="tab">
    <tbody><tr>
      <th>Nr.</th>
      <th>Name</th>
      <th>F/M</th>
    </tr>
    <tr *ngFor="let p of participants; let i = index">
      <td>{{i+1}}</td>
      <td>{{p.name}}</td>
      <td>{{p.gender}}</td>
    </tr>
    </tbody></table>
    <a href="">download</a>
  </div>
  <div class="participate_option" *ngIf="false">
    <a routerLink="./join" class="btn btn-2 mt-1">Piedalīties</a>
  </div>
  <div class="participate_option">
    <p>Tu esi vaiksmīgi piereģistrēts.</p>
    <button class="btn btn-danger">Atcelt registrāciju</button>
  </div>
</div>
  `,
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

  constructor() { }
  participantFormVisible = false;
  participants = participants;
  ngOnInit() {
  }

  downloadFile(data: Response) {
    // todo: prepare file and download it; should be available only for granted
  }

}
