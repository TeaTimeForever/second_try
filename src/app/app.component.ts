import { Component, OnInit } from '@angular/core';
import { stages } from './stages.mock';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  template: `
  <nav class="nav sb">
    <a class="nav-brand" href="">{{title}}</a>
    <ul>
      <li><a href="#">Profile</a></li>
    </ul>

    user: {{user$ | async}}
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

  constructor(private userService: UserService) {}

  user$ = this.userService.user$;
  ngOnInit() {

  }
}
