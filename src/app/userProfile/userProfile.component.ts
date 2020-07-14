import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { PilotProfile } from './pilotProfile';
import { Subject, zip, EMPTY, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, map, switchMap, distinctUntilChanged, debounceTime, withLatestFrom, filter, catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es'
import { UserService, UserPublicData, UserPersonalData } from '../user.service';
import { Stage } from '../stage/stage.model';
import { Participant } from '../participants/participant.model';

interface RouteParams {
  year?: string,
  stage?: string
}

@Component({
  selector: 'app-join',
  template: `
    <form [formGroup]="form" class="r-form center-children" *ngIf="form?.customValidateErrors | async as errors">
      <h2 class="center-text">Registracija</h2>
      <div class="field">
        <label for="name">Name</label>
        <input class="input-text"
               type="text"
               formControlName="name"
               name="name">
      </div>
      <div class="field">
        <label for="surname">Lastname</label>
        <input class="input-text"
               type="text"
               formControlName="surname"
               name="surname">
      </div>
      <div class="field">
        <label for="gender">Dzimums</label>
        <select name="gender" formControlName="gender">
          <option value="M">Vīr.</option>
          <option value="F">Siev.</option>
        </select>
      </div>
      <div class="field">
        <label for="phone">Mob. phone</label>
        <input class="input-text"
               type="text"
               formControlName="phone"
               name="phone">
      </div>
      <div class="field">
        <label for="licenseId">License Id</label>
        <input class="input-text"
               type="text"
               formControlName="licenseId"
               name="licenseId">
        <p *ngIf="errors.licenseId && form.controls.licenseId.touched" class="error">{{errors.licenseId[0]}}</p>
      </div>
      <div class="field">
        <label for="wing">Wing Model</label>
        <input class="input-text"
               type="text"
               formControlName="wing"
               name="wing">
      </div>
      <div class="field">
        <label for="wingClass">Wing class</label>
        <input class="input-text"
               type="text"
               formControlName="wingClass"
               name="wingClass">
      </div>
      
      <div class="field">
        <label for="emergencyContactName">Emergency Contact name</label>
        <input class="input-text"
               type="text"
               formControlName="emergencyContactName"
               name="emergencyContactName">
      </div>
      <div class="field">
        <label for="emergencyContactPhone">Emergency Contact phone</label>
        <input class="input-text"
               type="text"
               formControlName="emergencyContactPhone"
               name="emergencyContactPhone">
      </div>

      <div *ngIf="showStageOptions$ | async">
        <div class="field checkbox">
          <label for="firstTime">Vai šis ir Tavs pirmais XC kauss?</label>
          <input class="input-text"
                type="checkbox"
                formControlName="firstTime"
                name="firstTime">
        </div>
        <div class="field checkbox">
          <label for="retrieveNeeded">Vai būs nepieciešams retrīvs?</label>
          <input class="input-text"
                type="checkbox"
                formControlName="retrieveNeeded"
                name="retrieveNeeded">
        </div>
      </div>
      <div class="actions">
        <button [disabled]="!form.valid" *ngIf="showStageOptions$ | async" class="btn btn-2" (click)="registerButtonClicked$.next()">Pievienoties</button>
        <button class="btn btn-4" (click)="back()">Atpakaļ</button>
      </div>
    </form>
  `,
  styleUrls: ['./userProfile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private stageToSignUp$ = this.activatedRoute.queryParams.pipe(
    map(({ year, stage }: RouteParams) => (year && stage) ? { year, stage } : null)
  )
  showStageOptions$ = this.stageToSignUp$.pipe(
    map(s => s !== null)
  )
  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private router: Router
  ) { }
  registerButtonClicked$ = new Subject();

  fb = new DynamicFormBuilder();
  form = this.fb.group(PilotProfile, new PilotProfile());

  publicDataChanges: Observable<UserPublicData> = this.form.valueChanges.pipe(
    filter(() => this.form.valid),
    map(UserService.extractPublicData),
    distinctUntilChanged(isEqual),
    debounceTime(3000),
  );
  privateDataChanges: Observable<UserPersonalData> = this.form.valueChanges.pipe(
    filter(() => this.form.valid),
    map(UserService.extractPersonalData),
    distinctUntilChanged(isEqual),
    debounceTime(3000),
  );

  ngOnInit() {
    this.registerButtonClicked$.pipe(
      takeUntil(this.unsubscribe$),
      withLatestFrom(this.form.valueChanges as Observable<PilotProfile>, this.stageToSignUp$, this.user.user$)
    ).subscribe(async ([_, value, stageInfo, user]) => {
      this.form.markAllAsTouched();
      this.form.object = this.form.object;
      if (!this.form.valid || stageInfo === null) return;
      const { year, stage } = stageInfo
      try {
        await this.afs.doc<Participant>(`years/${year}/stages/${stage}/participants/${user!.uid}`).set({
          isFirstCompetition: value.firstTime,
          isRetrieveNeeded: value.retrieveNeeded,
          cancelled: false
        });
        await this.router.navigate(['/stage', year, stage, 'participants'], { queryParams: null });
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });

    // Pre-populate the form
    this.user.user$.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user => zip(this.afs.doc<UserPublicData>(`users/${user!.uid}`).get(), this.afs.doc<UserPersonalData>(`users/${user!.uid}/personal/contacts`).get()).pipe(
        map(([uPublic, uPersonal]): PilotProfile =>
          (!uPublic.exists && !uPersonal.exists) ?
            // If documents haven't been created, populate from auth
            UserService.initializeUserFromAuth(user!) :
            // Else merge public and private data in a single doc
            { ...uPublic.data() as UserPublicData, ...uPersonal.data() as UserPersonalData })
      ))
    ).subscribe(data => {
      this.form.patchValue(data);
    });

    // Send updates to firebase as user types in form
    this.publicDataChanges.pipe(
      takeUntil(this.unsubscribe$),
      withLatestFrom(this.user.user$)
    ).subscribe(([data, user]) => {
      console.log("Updating public", data);
      this.afs.doc<UserPublicData>(`users/${user!.uid}`).set(data);
    });

    this.privateDataChanges.pipe(
      takeUntil(this.unsubscribe$),
      withLatestFrom(this.user.user$)
    ).subscribe(([data, user]) => {
      console.log("Updating private", data);
      this.afs.doc<UserPersonalData>(`users/${user!.uid}/personal/contacts`).set(data);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  back() {
    window.history.back();
  }
}
