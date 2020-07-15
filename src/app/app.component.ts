import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stage } from './stage/stage.model';

@Component({
  selector: 'app-root',
  template: `
  <div class="container center">
  <nav class="nav sb top-nav">
    <!--a class="nav-brand" href="">{{title}} 2020</!--a-->
    <a class="nav-brand" href="">{{title}} 2020</a>
    <ul>
      <li *ngIf="!!(user$ | async) === false"><button (click)="loginClicked$.next()" class="btn prime">Login</button></li>
      <li class="user-name" *ngIf="user$ | async as user">{{user.displayName}}</li>
      <li *ngIf="user$ | async"><button (click)="logoutClicked$.next()" class="btn secondary">Logout</button></li>
    </ul>
  </nav>
  
    <nav class="nav stages">
      <li><a [routerLink]="['/regulations']"  routerLinkActive="active-link">Nolikums</a></li>
      <li *ngFor="let stage of stages$ | async">
        <a [ngClass]="{blink: stage.status === 'ongoing',
                       disabled: stage.status === 'announced',
                       cancelled: stage.status === 'cancelled'
                      }"
           routerLinkActive="active-link"
           [routerLink]="['/stage', year, stage.id]">{{stage.nr}}. posms</a>
      </li>
    </nav>
    <router-outlet style="display: none"></router-outlet>
  </div>
  <footer>
    <a href="privacypolicy">Privacy policy</a>
    <a href="termsofservice">Terms of Service</a>
  </footer>
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
