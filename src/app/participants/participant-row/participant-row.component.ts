import { Component, OnInit, ChangeDetectionStrategy, Input, Output, SimpleChange } from '@angular/core';
import { Participant, Task, HasId } from '../participant.model';
import { UserService } from 'src/app/user.service';
import { participants } from 'src/app/participants.mock';

@Component({
  selector: '[app-participant-row]',
  template: `
  <td><input type="checkbox" [(ngModel)]="participant.cancelled" /></td>
  <td>{{participant.registrationNumber}}</td>
  <td *ngIf="participant | participantData | async as person"> {{person.name}} {{person.surname}}</td>
  <ng-container *ngIf="!participant.cancelled">
    <ng-container *ngFor="let t of participant.tasks; let i = index;">
      <td><input type="number" [(ngModel)]="t.score"/></td>
      <td><input type="number" [(ngModel)]="t.distance"/></td>
      <td><input type="number" [(ngModel)]="t.speed" /></td>
      <td><input type="number" [(ngModel)]="t.maxHeight"/></td>
      <td><input type="text"   [(ngModel)]="t.start"/></td>
      <td><input type="text"   [(ngModel)]="t.finish"/></td>
      <td><input type="number" [(ngModel)]="t.penalty"/></td>
    </ng-container>
  </ng-container>
  <ng-container *ngIf="!participant.cancelled">
    <td  *ngFor="let t of tasks; let i = index;" colspan="7"></td>
  </ng-container>
  <td>{{participant.score}}</td>
  `,
  styleUrls: ['./participant-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantRowComponent implements OnInit {
  @Input() participant?: Participant & HasId;
  @Input() taskCount?: number;
  tasks: any[] = [];

  constructor(public userService: UserService) { }

  updateParticipant() {
    // const yearAndStageId = this.activatedRoute.snapshot.parent!.params;
    // this.afs.doc<Participant>(`years/${yearAndStageId.year}/stages/${yearAndStageId.id}/participants/${this.participantId}`).update(this.update);
  }
  ngOnInit() {
    this.tasks = new Array(this.taskCount);
    if (!this.participant!.tasks) {
      this.participant!.tasks = [];
      new Array(this.taskCount).forEach(_ => {
        console.log('push')
        this.participant!.tasks!.push({});
      })
      
    }
  }
}
