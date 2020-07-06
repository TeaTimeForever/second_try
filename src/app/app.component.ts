import { Component, OnInit } from '@angular/core';
import { stages } from './stages.mock';

@Component({
  selector: 'app-root',
  template: `
  <nav class="nav sb">
    <a class="nav-brand" href="">{{title}}</a>

    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">News</a></li>
      <li><a href="#">Contact</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>

  <div class="container center">
    <nav class="nav">
      <li *ngFor="let stage of stages"><a [href]="'stage/'+stage.id">{{stage.id}}.posms</a></li>
    </nav>
    <router-outlet style="display: none"></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'XC kauss';

  stages = stages;
  ngOnInit() {

  }
}
