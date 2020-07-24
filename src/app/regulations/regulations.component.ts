import { Component } from '@angular/core';
import { GhostService } from '../ghost.service';

@Component({
  selector: 'app-regulations',
  template: `
  <div class="content" >
    <div class="description container center" *ngIf="regulationsPage$ | async as page">
      <h1>{{page.title}}</h1>
      <div class="post" [innerHtml]="page.html"> </div>
    </div>
  </div>
  `,
  styleUrls: ['./regulations.component.scss']
})
export class RegulationsComponent {

  constructor(private stageService: GhostService) { }

  regulationsPage$ = this.stageService.getPage('2020-gada-nolikums');

}
