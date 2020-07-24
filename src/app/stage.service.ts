import { Injectable } from '@angular/core';
import GhostContentAPI from '@tryghost/content-api';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor(private sanitizer: DomSanitizer) { }

  api = GhostContentAPI({
    url: environment.ghost.url,
    key: environment.ghost.apiKey,
    version: 'v2'
  });

  getStageDescription(id: string) {
    return this.api.posts.read({ slug: `2020-posms-${id}` }, { formats: ['html', 'plaintext'] });
  }

  getRegulationsPage() {
    return this.api.pages.read({slug: `2020-gada-nolikums`}, {formats: ['html', 'plaintext']});
  }

  getGPSPage() {
    return this.api.pages.read({slug: `par-gps-lv`}, {formats: ['html', 'plaintext']})
    .then(res => res.html)
    .then(res => this.sanitizer.bypassSecurityTrustHtml(res as string));
  }
}
