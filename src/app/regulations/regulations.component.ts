import { Component, OnInit } from '@angular/core';
import { StageService } from '../stage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-regulations',
  template: `
  <div class="content" >
    <div class="description container center">
      <h1>{{title | async}}</h1>
      <div class="post" [innerHtml]="description | async"> </div>
    </div>
  </div>
  `,
  styleUrls: ['./regulations.component.scss']
})
export class RegulationsComponent implements OnInit {

  constructor( private stageService: StageService,
    private sanitizer: DomSanitizer) { }

  description;
  title;
  ngOnInit() {

    const regulationsPage = this.stageService.getRegulationsPage();

    this.description = regulationsPage
      .then(res => res.html)
      .then(res => this.sanitizer.bypassSecurityTrustHtml(res));

    this.title = regulationsPage
      .then(res => res.title)
  }

}
