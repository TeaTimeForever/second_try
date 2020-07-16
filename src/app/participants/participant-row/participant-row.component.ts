import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { UserPublicData, UserService } from 'src/app/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: '[app-participant-row]',
  template: `
    <ng-container *ngIf="participant$ | async as p">
      <td>{{nr}}</td>
      <td>{{p.name}} {{p.surname}}</td>
      <td  class="manage-registration" *ngIf="userId$ | async as uId">
        <div *ngIf="participantId === uId" (click)="removeUser.next()"><img src="./assets/recycle.png" alt="Atteikties"></div>
      </td>
    </ng-container>
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
    private userService: UserService) { }

  userId$ = this.userService.user$.pipe(map(user => user? user.uid : ''))
  ngOnInit() {
    this.participant$ = this.afs.doc<UserPublicData>(`users/${this.participantId!}`).valueChanges()
  }

}
