import { Injectable } from '@angular/core';
import GhostContentAPI from '@tryghost/content-api';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class GhostService {

  constructor(private sanitizer: DomSanitizer) { }

  api = GhostContentAPI({
    url: environment.ghost.url,
    key: environment.ghost.apiKey,
    version: 'v2'
  });

  getStageDescription(year: string, id: string) {
    return this.api.posts.read({ slug: `${year}-posms-${id}` }, { formats: ['html', 'plaintext'] });
  }

  getPage(slug: string) {
    return this.api.pages.read({slug}, {formats: ['html', 'plaintext']})
    .then(res => ({
      title: res.title,
      html: this.sanitizer.bypassSecurityTrustHtml(res.html as string)
    }))
  }
}
