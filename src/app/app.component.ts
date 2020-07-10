import { Component, OnInit } from '@angular/core';
import { stages } from './stages.mock';
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stage } from './stage/stage.model';

@Component({
  selector: 'app-root',
  template: `
  <nav class="nav sb">
    <a class="nav-brand" href="">{{title}}</a>
    <ul>
      <li *ngIf="!!(user$ | async) === false"><button (click)="loginClicked$.next()" class="btn btn-5 mt-1">Login</button></li>
      <li *ngIf="user$ | async">{{(user$| async)?.displayName}}</li>
      <li *ngIf="user$ | async"><button (click)="logoutClicked$.next()" class="btn btn-5 mt-1">Logout</button></li>
    </ul>
  </nav>
  <div class="container center">
    <nav class="nav">
      <li *ngFor="let stage of stages$ | async">
        <a [ngClass]="{blink: stage.status === 'ongoing',
                       disabled: stage.status === 'announced'}"
           [href]="'stage/' + year + '/' + stage.id">{{stage.nr}}. posms</a>
      </li>
    </nav>
    <router-outlet style="display: none"></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'XC kauss';
  logoutClicked$ = new Subject();
  loginClicked$ = new Subject();
  year = new Date().getFullYear();

  constructor(private userService: UserService, private afs: AngularFirestore) { }

  user$ = this.userService.user$;
  stages$ = this.afs.collection<Stage>(`years/${this.year}/stages`, q => q.orderBy('nr', 'asc')).valueChanges({ idField: 'id' })

  ngOnInit() {
    this.loginClicked$.subscribe(async () => {
      await this.userService.loginWithGoogle();
    });

    this.logoutClicked$.subscribe(async () => {
      await this.userService.logout();
    });
  }
}
