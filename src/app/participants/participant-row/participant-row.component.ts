import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-participant-row',
  template: `
    <p>
      participant-row works!
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantRowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
