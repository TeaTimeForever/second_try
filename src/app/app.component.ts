import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <nav class="nav sb">
    <a class="nav-brand" href="">Second Try</a>

    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">News</a></li>
      <li><a href="#">Contact</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>

  <div class="container center">
    <nav class="nav">
      <li><a href="stage/1">1.posms</a></li>
      <li><a href="stage/2">2.posms</a></li>
      <li><a href="stage/3">3.posms</a></li>
    </nav>
    <router-outlet style="display: none"></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'secondtry';
}
