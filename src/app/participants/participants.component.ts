import { Component, OnDestroy } from '@angular/core';
import { participants } from '../participants.mock';
import { Subject, Observable, of } from 'rxjs';
import { UserService, UserPublicData } from '../user.service';
import { switchMap, distinctUntilChanged, map, withLatestFrom, first, startWith } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Participant, HasId } from './participant.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    </tr>
    <tr app-participant-row *ngFor="let p of participantList$ | async; let i = index; trackBy: trackById"
      [nr]="i+1"
      [participantId]="p.id"
      (removeUser)="removeParticipation$.next()"></tr>
    </tbody></table>
    <!--<a href="">download</a>-->
  </div>
  <div class="participate_option" *ngIf="joinButtonPurpose$ | async as purpose">
    <div class="good-luck" *ngIf="(joinButtonPurpose$ | async) === 'leave'">
      Jūs esat veikmīgi piereģistrējušies uz sacensībam.
    </div>
    <button *ngIf="(joinButtonPurpose$ | async) !== 'leave'"
      (click)="joinToggleButtonClicks$.next()"
      class="btn prime">{{joinButtonText$ | async}}</button>
    <div class="join" *ngIf="(joinButtonPurpose$ | async) === 'join'">
      <label><input type="checkbox" [(ngModel)]="retrieveNeeded" />Būs nepieciešams retrīvs</label>
      <label><input type="checkbox" [(ngModel)]="firstTry" />Šī būs mana pirmā dalība XCKausā</label>
    </div>
  </div>
</div>
  `,
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnDestroy {
  retrieveNeeded: boolean = true;
  firstTry: boolean = false;
  joinToggleButtonClicks$ = new Subject<void>();
  removeParticipation$ = new Subject<void>()
  yearAndStageId$ = (this.activatedRoute.parent!.params as Observable<{ year: string, id: string }>).pipe(
    distinctUntilChanged((a, b) => a.id === b.id && a.year === b.year),
  );
  participantList$: Observable<Array<Participant & HasId>> = this.yearAndStageId$.pipe(
    switchMap(({ id, year }) => this.afs.collection<Participant>(`years/${year}/stages/${id}/participants`, ref => ref.where('cancelled', '==', false)).valueChanges({ idField: 'id' }))
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
    ),
    startWith('leave')
  );
  joinButtonText$ = this.joinButtonPurpose$.pipe(
    startWith('join'),
    map(purpose => purpose === "login" ? 'Ielogoties lai pieteiktos' :
      purpose === 'register' ? 'Reģistrēties' : 'join')
  );
  subscription$ = this.joinToggleButtonClicks$.pipe(
    withLatestFrom(this.joinButtonPurpose$, this.yearAndStageId$, this.userService.user$)
  ).subscribe(async ([_, purpose, { year, id }, user]): Promise<void> => {
    try {
      switch (purpose) {
        case 'login':
          await this.userService.login();
          await this.router.navigate(['/personal'], { queryParams: { year, stage: id } })
          break;
        case 'register':
          await this.router.navigate(['/personal'], { queryParams: { year, stage: id } });
          break;
        case 'join':
          if (user === null) return;
          await this.afs.doc<Participant>(`years/${year}/stages/${id}/participants/${user.uid}`).set({
            isFirstCompetition: this.firstTry,
            isRetrieveNeeded: this.retrieveNeeded,
            cancelled: false,
          });
          break;
      }
    } catch (err) {
      this.snack.open(err.message, 'Aizvērt');
    }
  });

  constructor(
    private userService: UserService,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) { }
  participantFormVisible = false;
  participants = participants;

  ngOnInit() {

    this.subscription$.add(
      this.removeParticipation$.pipe(
        withLatestFrom(this.yearAndStageId$, this.userService.user$))
        .subscribe(async ([_, { year, id }, user]): Promise<void> => {
          try {
            await this.afs.doc<Participant>(`years/${year}/stages/${id}/participants/${user!.uid}`).update({
              cancelled: true
            });
          } catch (e) {
            console.log('TODO')
          }
        }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  trackById(_index: number, { id }: HasId) {
    return id;
  }

  downloadFile(data: Response) {
    // todo: prepare file and download it; should be available only for granted
  }
}
