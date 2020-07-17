import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { PilotProfile } from './pilotProfile';
import { Subject, zip, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, map, switchMap, distinctUntilChanged, debounceTime, withLatestFrom, filter, catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es'
import { UserService, UserPublicData, UserPersonalData } from '../user.service';
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
        <label for="name">Vārds</label>
        <input class="input-text"
               type="text"
               formControlName="name"
               name="name">
        <p *ngIf="errors.name && form.controls.name.touched" class="error">{{errors.name[0]}}</p>
      </div>
      <div class="field">
        <label for="surname">Uzvārds</label>
        <input class="input-text"
               type="text"
               formControlName="surname"
               name="surname">
        <p *ngIf="errors.surname && form.controls.surname.touched" class="error">{{errors.surname[0]}}</p>
      </div>
      <div class="field">
        <label for="gender">Dzimums</label>
        <select name="gender" formControlName="gender">
          <option value="M">Vīr.</option>
          <option value="F">Siev.</option>
        </select>
      </div>
      <div class="field">
        <label for="phone">Tel. numurs</label>
        <input class="input-text"
               type="text"
               formControlName="phone"
               name="phone">
        <p *ngIf="errors.phone && form.controls.phone.touched" class="error">{{errors.phone[0]}}</p>
      </div>
      <div class="field">
        <label for="licenseId">Licences kategorija</label>
        <input class="input-text"
               type="text"
               formControlName="licenseCategory"
               name="licenseCategory">
        <p *ngIf="errors.licenseCategory && form.controls.licenseCategory.touched" class="error">{{errors.licenseCategory[0]}}</p>
      </div>
      <div class="field">
        <label for="licenseId">Licences ID</label>
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
        <p *ngIf="errors.licenseId && form.controls.licenseId.touched" class="error">{{errors.licenseId[0]}}</p>
      </div>
      <div class="field">
        <label for="wingClass">Wing class</label>
        <input class="input-text"
               type="text"
               formControlName="wingClass"
               name="wingClass">
        <p *ngIf="errors.wingClass && form.controls.wingClass.touched" class="error">{{errors.wingClass[0]}}</p>
      </div>
      
      <div class="field">
        <label for="emergencyContactName">Emergency Contact name</label>
        <input class="input-text"
               type="text"
               formControlName="emergencyContactName"
               name="emergencyContactName">
        <p *ngIf="errors.emergencyContactName && form.controls.emergencyContactName.touched" class="error">{{errors.emergencyContactName[0]}}</p>
      </div>
      <div class="field">
        <label for="emergencyContactPhone">Emergency Contact phone</label>
        <input class="input-text"
               type="text"
               formControlName="emergencyContactPhone"
               name="emergencyContactPhone">
        <p *ngIf="errors.emergencyContactPhone && form.controls.emergencyContactPhone.touched" class="error">{{errors.emergencyContactPhone[0]}}</p>
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
        <button *ngIf="showStageOptions$ | async" class="btn btn-2" (click)="registerButtonClicked$.next()">Pievienoties</button>
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
    takeUntil(this.unsubscribe$),
    filter(() => this.form.valid),
    map(UserService.extractPublicData),
    debounceTime(2000),
    distinctUntilChanged(isEqual),
  );
  privateDataChanges: Observable<UserPersonalData> = this.form.valueChanges.pipe(
    takeUntil(this.unsubscribe$),
    filter(() => this.form.valid),
    map(UserService.extractPersonalData),
    debounceTime(2000),
    distinctUntilChanged(isEqual),
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
      withLatestFrom(this.user.user$)
    ).subscribe(([data, user]) => {
      this.afs.doc<UserPublicData>(`users/${user!.uid}`).set(data);
    });

    this.privateDataChanges.pipe(
      withLatestFrom(this.user.user$)
    ).subscribe(([data, user]) => {
      this.afs.doc<UserPersonalData>(`users/${user!.uid}/personal/contacts`).set(data, { merge: true });
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
