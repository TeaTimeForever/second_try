import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../stage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { stages } from '../stages.mock';
import { environment } from 'src/environments/environment';
import { GoogleMap } from '@googlemaps/map-loader';

@Component({
  selector: 'app-stage',
  template: `
  <div class="ml-3">
    <h1>{{title | async}}</h1>
    <div class="text-container" [innerHtml]="description | async"> </div>

    <div id="google_map"></div>
    <div>{{stage.price}}</div>
    <div>{{stage.date}}</div>
  </div>
  `,
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute,
              private stageService: StageService,
              private sanitizer: DomSanitizer) { }

  id: any;
  description;
  title;
  stage;
  async ngOnInit() {
    const pathParams = this.activeRoute.snapshot.params;
    this.id = (Object.keys(pathParams).length)? pathParams.id : '1';

    const stagePost = this.stageService.getStageDescription(this.id);

    this.description = stagePost
      .then(res => res.html)
      .then(res => this.sanitizer.bypassSecurityTrustHtml(res));

    this.title = stagePost
      .then(res => res.title)

   this.stage = stages.find(s => s.id.toString() === this.id);


    const mapOptions = {
      center: {
        lat: 56.649196,
        lng: 25.350384
      },
      zoom: 8
    }
    
    const apiOptions = {
      version: 'weekly',
      libraries: ['places']
    }

    const mapLoaderOptions = {
      apiKey: environment.googlemap,
      divId: 'google_map',
      append: false, // Appends to divId. Set to false to init in divId.
      mapOptions: mapOptions,
      apiOptions: apiOptions
    };

    const mapLoader = new GoogleMap();
 
    // Load the map
    const googleMap = await mapLoader.initMap(mapLoaderOptions);

    new google.maps.Marker({
      map: googleMap,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: mapOptions.center
    });

    console.log(googleMap);
  }

}
