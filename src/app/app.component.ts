import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  template: `
  <div class="container center">
  <nav class="nav sb top-nav">
    <a class="nav-brand" href=""><img src="./assets/XClogo.png"/></a>
    <div class="middle">
      <a [routerLink]="['/regulations']"  routerLinkActive="active-link">Nolikums</a>
      <a [routerLink]="['/gps']"  routerLinkActive="active-link">Par GPS</a>
      <a [routerLink]="['/stage', 2020, 6]"  routerLinkActive="active-link">Sacensību sezona</a>
      <!--a [routerLink]="['/organisators']"  routerLinkActive="active-link">Organizatori</a-->
    </div>
    <div class="auth">
      <div  class="user-name" *ngIf="!!(user$ | async) === false">
        <button (click)="loginClicked$.next()" class="btn prime-inv">Login</button>
      </div>
      <div class="user-name" *ngIf="user$ | async as user">
        <span>{{user.displayName}}</span>
        <button (click)="logoutClicked$.next()" class="btn prime-inv">Iziet</button>
      </div>
    </div>
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

  constructor(private userService: UserService, private afs: AngularFirestore, private snack: MatSnackBar) { }

  user$ = this.userService.user$;

  ngOnInit() {
    this.loginClicked$.subscribe(async () => {
      try {
        await this.userService.login();
      } catch (err) {
        if (err.message === 'Atcelts') return;
        this.snack.open(err.message, 'Aizvērt');
      }
    });

    this.logoutClicked$.subscribe(async () => {
      await this.userService.logout();
    });
  }
}
