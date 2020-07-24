import { Component, OnInit } from '@angular/core';
import { GhostService } from '../ghost.service';

@Component({
  selector: 'app-gps',
  template: `
  <div class="stage-content">
    <div class="container center">
      <div class="map">
        <iframe src="https://www.google.com/maps/d/embed?mid=1T7lctRBD5xt_jj31Kx35GqRIhIKGyJM1&hl=lv&width=100%25&amp;height=600;"
          width="100%"
          height="600"
          zoom="7"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          style="margin-top: -55px;"></iframe>
      </div>
      <div class="post" [innerHtml]="(gpsPage$ | async)?.html"></div>
    </div>
  </div>
  `,
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit {

  gpsPage$ = this.stageService.getPage('par-gps-lv');
  constructor(private stageService: GhostService) { }

  ngOnInit() {
  }

}
