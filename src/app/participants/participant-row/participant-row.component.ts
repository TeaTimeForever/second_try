import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserPublicData } from 'src/app/user.service';

@Component({
  selector: '[app-participant-row]',
  template: `
    <ng-container *ngIf="participant$ | async as p">
      <td>{{nr}}</td>
      <td>{{p.name}} {{p.surname}}</td>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantRowComponent implements OnInit {
  @Input() nr?: number;
  @Input() participantId?: string;
  participant$?: Observable<UserPublicData | undefined>;
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.participant$ = this.afs.doc<UserPublicData>(`users/${this.participantId!}`).valueChanges()
  }

}
