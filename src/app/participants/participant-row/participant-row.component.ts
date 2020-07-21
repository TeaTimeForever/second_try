import { Component, OnInit, ChangeDetectionStrategy, Input, Output, SimpleChange } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, of } from 'rxjs';
import { UserPublicData, UserService } from 'src/app/user.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Participant } from '../participant.model';

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
    <div class="set" *ngIf="false && userService.isAdmin$ | async">
      <div>DNS<input type="checkbox" placeholder="dns" [(ngModel)]="update.dns"/></div>
      <input *ngIf="!update.dns" type="number" placeholder="Reģ. Nr." [(ngModel)]="update.registrationNumber" />
      <input *ngIf="!update.dns" type="number" placeholder="Punkti" [(ngModel)]="update.score"/>
      <input *ngIf="!update.dns" type="number" placeholder="Distance" [(ngModel)]="update.distance"/>
      <input *ngIf="!update.dns" type="number" placeholder="Max. Augstums" [(ngModel)]="update.maxHeight"/>
      <input *ngIf="!update.dns" type="text" placeholder="Starts SS" [(ngModel)]="update.start"/>
      <button (click)="updateParticipant()">save</button>
    </div>
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
  update = {}
  ngOnInit() {
    this.participant$ = this.afs.doc<UserPublicData>(`users/${this.participantId!}`).valueChanges()
  }

  updateParticipant() {
    const yearAndStageId = this.activatedRoute.snapshot.parent!.params;
    this.afs.doc<Participant>(`years/${yearAndStageId.year}/stages/${yearAndStageId.id}/participants/${this.participantId}`).update(this.update);
  }

}
