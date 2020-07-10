import { Injectable } from '@angular/core';
import GhostContentAPI from '@tryghost/content-api';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor() { }

  api = GhostContentAPI({
    url: environment.ghost.url,
    key: environment.ghost.apiKey,
    version: 'v2'
  });

  getStageDescription(id) {
    return this.api.posts.read({slug: `2020-posms-${id}`}, {formats: ['html', 'plaintext']});
  }

  getRegulationsPage() {
    return this.api.pages.read({slug: `2020-gada-nolikums`}, {formats: ['html', 'plaintext']});
  }
}
