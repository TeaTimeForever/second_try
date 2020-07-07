import { Component, OnInit } from '@angular/core';
import { stages } from './stages.mock';
import { UserService } from './user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  <nav class="nav sb">
    <a class="nav-brand" href="">{{title}}</a>
    <ul>
      <li *ngIf="!!(user$ | async) === false"><button (click)="loginClicked$.next()" class="btn btn-5 mt-1">Login</button></li>
      <li *ngIf="user$ | async">{{(user$| async).displayName}}</li>
      <li *ngIf="user$ | async"><button (click)="logoutClicked$.next()" class="btn btn-5 mt-1">Logout</button></li>
    </ul>
  </nav>
  <div class="container center">
    <nav class="nav">
      <li *ngFor="let stage of stages">
        <a [ngClass]="{blink: stage.status === 'ongoing',
                       disabled: stage.status === 'announced'}"
           [href]="'stage/'+stage.id">{{stage.id}}.posms</a>
      </li>
    </nav>
    <router-outlet style="display: none"></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'XC kauss';
  stages = stages;
  logoutClicked$ = new Subject();
  loginClicked$ = new Subject();

  constructor(private userService: UserService) {}

  user$ = this.userService.user$;
  ngOnInit() {

    this.loginClicked$.subscribe(async () => {
      await this.userService.loginWithGoogle();
    });

    this.logoutClicked$.subscribe(async () => {
      await this.userService.logout();
    });
  }
}
