import { Component, OnDestroy } from '@angular/core';
import { participants } from '../participants.mock';
import { Subject, Observable, of } from 'rxjs';
import { UserService, UserPublicData } from '../user.service';
import { switchMap, distinctUntilChanged, map, withLatestFrom, tap, startWith, first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Participant, HasId } from './participant.model';
import { ActivatedRoute, Router } from '@angular/router';

/** Depending on current state - the join button can trigger multiple possibilities login window, registration form, toggling to join for the competition, leaving the competition */
type JoinPurpose = 'login' | 'register' | 'join' | 'leave';

@Component({
  selector: 'app-participants',
  template: `

  <router-outlet (activate)="participantFormVisible=true"
                 (deactivate)="participantFormVisible=false"
                 style="display: none"></router-outlet>
  <div class="content" *ngIf="!participantFormVisible">
  <div class="table_wrap">
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
  <div class="participate_option">
  	<button *ngIf="joinButtonText$ | async as text" (click)="joinToggleButtonClicks$.next()" class="btn btn-2 mt-1">{{text}}</button>
  </div>
</div>
  `,
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnDestroy {
  joinToggleButtonClicks$ = new Subject<void>();
  yearAndStageId$ = (this.activatedRoute.parent!.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.id === b.id && a.year === b.year),
  );
  participantList$: Observable<Array<Participant & HasId>> = this.yearAndStageId$.pipe(
    switchMap(({ id, year }) => this.afs.collection<Participant>(`years/${year}/stages/${id}`).valueChanges({ idField: 'id' }))
  )
  /** What will happen when join button will be pressed? (depends on current login state and whether user has registered or clicked participate) */
  joinButtonPurpose$: Observable<JoinPurpose> = this.userService.user$.pipe(
    switchMap(user =>
      (user === null) ? of<JoinPurpose>('login') :
        // Now check if user has a document
        this.afs.doc<UserPublicData>(`users/${user.uid}`).valueChanges().pipe(
          first(),
          switchMap(userPublicDoc =>
            (userPublicDoc === undefined) ? of<JoinPurpose>('register') :
              // Now check if user is among listed participants in this stage
              this.participantList$.pipe(
                map(list => list.some(participant => participant.id === user.uid) ? 'leave' : 'join')
              )
          )
        )
    )
  );
  joinButtonText$ = this.joinButtonPurpose$.pipe(
    map(purpose => purpose === "login" ? 'Ielogoties lai reģistrētos' :
      purpose === 'register' ? 'Reģistrēties' :
        purpose === 'join' ? 'Pieteikties posmam' : 'Atteikties no dalības posmā')
  );
  subscription$ = this.joinToggleButtonClicks$.pipe(
    withLatestFrom(this.joinButtonPurpose$, this.yearAndStageId$, this.userService.user$)
  ).subscribe(async ([_, purpose, { year, id }, user]): Promise<void> => {
    try {
      switch (purpose) {
        case 'login':
          await this.userService.loginWithGoogle()
          await this.router.navigate(['/personal'], { queryParams: { year, stage: id } })
          break;
        case 'register':
          await this.router.navigate(['/personal'], { queryParams: { year, stage: id } });
          break;
        case 'join':
          if (user === null) return;
          await this.afs.doc<Participant>(`years/${year}/stages/${id}/participants/${user.uid}`).set({
            isFirstCompetition: true,
            isRetrieveNeeded: true
          });
          break;
        case 'leave':
          if (user === null) return;
          await this.afs.doc<Participant>(`years/${year}/stages/${id}/participants/${user.uid}`).set({
            cancelled: true
          });
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });
  constructor(
    private userService: UserService,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  participantFormVisible = false;
  participants = participants;

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  downloadFile(data: Response) {
    // todo: prepare file and download it; should be available only for granted
  }
}
