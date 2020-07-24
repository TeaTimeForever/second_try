import { Component, OnInit } from '@angular/core';
import { GhostService } from '../ghost.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { tap } from 'rxjs/operators';
import { stringify } from 'querystring';

@Component({
  selector: 'app-gps',
  template: `
  <div class="stage-content">
    <div class="container center">
      <h2>Kontrolpunkti</h2>
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
      <br>
      <h3>Priekš GPS ierices</h3>
      <div class="points" *ngFor="let gps of gpsList$ | async">
        <a [href]="gps.path">{{gps.name}}</a>
      </div>
      <br>
      <div class="post" [innerHtml]="(gpsPage$ | async)?.html"></div>
    </div>
  </div>
  `,
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit {

  gpsPage$ = this.stageService.getPage('par-gps-lv');
  gpsList$ = this.storage.storage
    .ref('map/')
    .listAll()
    .then(async (list) => {
      let res = new Array<{name: string, path: string}>();
      list.items.forEach(async (ref) => {
        res.push({
          name: ref.name,
          path: await this.storage.storage.ref(ref.fullPath).getDownloadURL()
        })
      })
      return res;
    });
  constructor(
    private stageService: GhostService,
    public storage: AngularFireStorage) { }

  ngOnInit() {
    
  }

}
