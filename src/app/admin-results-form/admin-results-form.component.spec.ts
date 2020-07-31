import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResultsFormComponent } from './admin-results-form.component';

describe('AdminResultsFormComponent', () => {
  let component: AdminResultsFormComponent;
  let fixture: ComponentFixture<AdminResultsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminResultsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminResultsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
