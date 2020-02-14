import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubScheduleComponent } from './club-schedule.component';

describe('ClubScheduleComponent', () => {
  let component: ClubScheduleComponent;
  let fixture: ComponentFixture<ClubScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
