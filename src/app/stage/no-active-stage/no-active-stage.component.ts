import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-active-stage',
  template: `
    <p>
      No stage is currently active
    </p>
  `,
})
export class NoActiveStageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
