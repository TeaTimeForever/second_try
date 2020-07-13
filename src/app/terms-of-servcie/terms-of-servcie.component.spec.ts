import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfServcieComponent } from './terms-of-servcie.component';

describe('TermsOfServcieComponent', () => {
  let component: TermsOfServcieComponent;
  let fixture: ComponentFixture<TermsOfServcieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsOfServcieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfServcieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
