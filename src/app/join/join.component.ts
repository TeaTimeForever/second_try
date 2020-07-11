import { Component, OnInit } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { PilotProfile } from './pilotProfile';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-join',
  template: `
    <form [formGroup]="form" class="r-form center-children" *ngIf="form?.customValidateErrors | async as errors">
      <h2 class="center-text">Registracija</h2>
      <div>
        <label for="name">Name</label>
        <input class="input-text"
               type="text"
               formControlName="name"
               name="name">
      </div>
      <div>
        <label for="surname">Lastname</label>
        <input class="input-text"
               type="text"
               formControlName="surname"
               name="surname">
      </div>
      <div>
        <label for="mobile">Mob. phone</label>
        <input class="input-text"
               type="text"
               formControlName="mobile"
               name="mobile">
      </div>
      <div>
        <label for="licenseId">License Id</label>
        <input class="input-text"
               type="text"
               formControlName="licenseId"
               name="licenseId">
        <p *ngIf="errors.licenseId && form.controls.licenseId.touched" class="error">{{errors.licenseId[0]}}</p>
      </div>
      <div>
        <label for="wing">Wing Model</label>
        <input class="input-text"
               type="text"
               formControlName="wing"
               name="wing">
      </div>
      <div>
        <label for="wingLevel">Wing class</label>
        <input class="input-text"
               type="text"
               formControlName="wingLevel"
               name="wingLevel">
      </div>
      
      <div>
        <label for="emergencyContactName">Emergency Contact name</label>
        <input class="input-text"
               type="text"
               formControlName="emergencyContactName"
               name="emergencyContactName">
      </div>
      <div>
        <label for="emergencyContactPhone">Emergency Contact phone</label>
        <input class="input-text"
               type="text"
               formControlName="emergencyContactPhone"
               name="emergencyContactPhone">
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
      console.log('valid?', this.form.valid);
    });
  }


}
