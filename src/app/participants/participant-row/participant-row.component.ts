import { Component, OnInit, ChangeDetectionStrategy, Input, Output, SimpleChange } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, of } from 'rxjs';
import { UserPublicData, UserService } from 'src/app/user.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Participant, Task } from '../participant.model';

@Component({
  selector: '[app-participant-row]',
  template: `
    <span *ngIf="participant$ | async as p">{{p.name}} {{p.surname}}</span>
    <div *ngIf="userId$ | async as uId" class="manage-registration">
      <img *ngIf="participantId === uId"
          (click)="removeUser.next()"
          src="./assets/cloud-off.png"
          alt="Atteikties">
    </div>
    <!--div class="set" *ngIf="userService.isAdmin$ | async">
      <input type="number" placeholder="Reģ. Nr." [(ngModel)]="update!.registrationNumber" />
      <input type="number" placeholder="score" [(ngModel)]="update!.score"/>
    <span>punkti</span>
      <input type="number" placeholder="Punkti-1" [(ngModel)]="update!.tasks[0]!.score"/>
      <input type="number" placeholder="Punkti-2" [(ngModel)]="update!.tasks[1]!.score"/>
      
    <span>task1: </span>
      <input type="number" placeholder="Distance-1" [(ngModel)]="update!.tasks[0]!.distance"/>
      <input type="number" placeholder="Max. Augstums-1" [(ngModel)]="update!.tasks[0]!.maxHeight"/>
      <input type="text" placeholder="Starts SS-1" [(ngModel)]="update!.tasks[0]!.start"/>
      <input type="text" placeholder="Fin SS-1" [(ngModel)]="update!.tasks[0]!.finish"/>
      <input type="number" placeholder="Speed-1" [(ngModel)]="update!.tasks[0]!.speed"/>
    <span>task2: </span>
      <input type="number" placeholder="Distance-2" [(ngModel)]="update!.tasks[1].distance"/>
      <input type="number" placeholder="Max. Augstums-2" [(ngModel)]="update!.tasks[1].maxHeight"/>
      <input type="text" placeholder="Starts SS-2" [(ngModel)]="update!.tasks[1].start"/>
      <input type="text" placeholder="Finish SS-2" [(ngModel)]="update!.tasks[1].finish"/>
      <input type="number" placeholder="Speed-2" [(ngModel)]="update!.tasks[1].speed"/>
      <button (click)="updateParticipant()">save</button>
    </!--div-->
  `,
  styleUrls: ['./participant-row.component copy.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantRowComponent implements OnInit {
  @Input() nr?: number;
  @Input() participantId?: string;
  @Output() removeUser = new Subject();

  participant$?: Observable<UserPublicData | undefined>;
  constructor(
    private afs: AngularFirestore,
    public userService: UserService,
    private activatedRoute: ActivatedRoute) { }

  userId$ = this.userService.user$.pipe(map(user => user? user.uid : ''))
  update = {
    tasks: [{} as Task, {} as Task]
  } as Participant;
  ngOnInit() {
    this.participant$ = this.afs.doc<UserPublicData>(`users/${this.participantId!}`).valueChanges()
  }

  // updateParticipant() {
  //   const yearAndStageId = this.activatedRoute.snapshot.parent!.params;
  //   this.afs.doc<Participant>(`years/${yearAndStageId.year}/stages/${yearAndStageId.id}/participants/${this.participantId}`).update(this.update);
  // }

}
