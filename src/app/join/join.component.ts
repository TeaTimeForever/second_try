import { Component, OnInit } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { PilotProfile } from './pilotProfile';
import { Subject } from 'rxjs';

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
        <label for="mobile">Mob. phone</label>
        <input class="input-text"
               type="text"
               formControlName="mobile"
               name="mobile">
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
        <label for="wingLevel">Wing class</label>
        <input class="input-text"
               type="text"
               formControlName="wingLevel"
               name="wingLevel">
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

      <div class="field checkbox">
        <label for="firstTime">Vai tas ir pirmais XC kauss?</label>
        <input class="input-text"
               type="checkbox"
               formControlName="firstTime"
               name="firstTime">
      </div>
      <div class="field checkbox">
        <label for="retrieveNeeded">Vai vajag retrīvu?</label>
        <input class="input-text"
               type="checkbox"
               formControlName="retrieveNeeded"
               name="retrieveNeeded">
      </div>
      <div class="actions">
        <button class="btn btn-2" (click)="registerButtonClicked$.next()">Pievienoties</button>
        <button class="btn btn-4" (click)="window.history.back()">Atpakaļ</button>
      </div>
    </form>
  `,
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  constructor() {

  }
  profile = {} as PilotProfile;
  registerButtonClicked$ = new Subject();

  fb = new DynamicFormBuilder();
  form = this.fb.group(PilotProfile, new PilotProfile());

  ngOnInit() {
    this.registerButtonClicked$.subscribe(() => {
      this.form.markAllAsTouched();
      this.form.object = this.form.object;
      console.log(this.form.object)
      console.log('valid?', this.form.valid);
    });
  }


}
