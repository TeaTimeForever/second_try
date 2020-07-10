import { Component, OnInit } from '@angular/core';
import { PilotProfile } from './pilotProfile';

@Component({
  selector: 'app-join',
  template: `
    <form class="r-form center-children">
      <h2 class="center-text">Registracija</h2>
      <div>
        <label for="name">Name</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.name"
               name="name">
      </div>
      <div>
        <label for="surname">Lastname</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.surname"
               name="surname">
      </div>
      <div>
        <label for="mobile">Mob. phone</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.mobile"
               name="mobile">
      </div>
      <div>
        <label for="email">Email</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.email"
               name="email">
      </div>
      <div>
        <label for="licenseId">License Id</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.licenseId"
               name="licenseId">
      </div>
      <div>
        <label for="wing">Wing Model</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.wing"
               name="wing">
      </div>
      <div>
        <label for="wingLevel">Wing class</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.wingLevel"
               name="wingLevel">
      </div>
      
      <div>
        <label for="emergencyContactName">Emergency Contact name</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.emergencyContactName"
               name="emergencyContactName">
      </div>
      <div>
        <label for="emergencyContactPhone">Emergency Contact phone</label>
        <input class="input-text"
               type="text"
               required
               [(ngModel)]="profile.emergencyContactPhone"
               name="emergencyContactPhone">
      </div>
      <div class="actions">
        <button class="btn btn-2" (click)="register()">Register</button>
        <button class="btn btn-4" (click)="window.history.back()">Back</button>
      </div>
    </form>
  `,
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  constructor() { }
  profile = {} as PilotProfile;

  ngOnInit() {
  }

  register() {
    console.log(this.profile);
  }

}
