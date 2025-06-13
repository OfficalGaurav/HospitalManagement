import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAppointmentsComponent } from './calendar-appointments.component';

describe('CalendarAppointmentsComponent', () => {
  let component: CalendarAppointmentsComponent;
  let fixture: ComponentFixture<CalendarAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
