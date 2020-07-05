import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../stage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-stage',
  template: `
    <p>
      stage works!

      id: {{id}}
    </p>
    <div>{{description | async}}</div>
    <div [innerHtml]="'lala'"> </div>
  `,
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute,
              private stageService: StageService,
              private sanitizer: DomSanitizer) { }

  id: any;
  description;
  ngOnInit() {
    const pathParams = this.activeRoute.snapshot.params;
    this.id = (Object.keys(pathParams).length)? pathParams.id : 'default';

    this.description = this.stageService.getStageDescription(this.id)
      .then(res => {
        console.log(1, res);
        return res;
      })
      .then(res => res.html)
      .then(res => {
        console.log(2, res);
        return res;
      })
      .then(res => this.sanitizer.bypassSecurityTrustHtml(res));
  }

}
