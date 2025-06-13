import { TestBed } from '@angular/core/testing';

import { CompletedAppointmentsService } from './completed-appointments.service';

describe('CompletedAppointmentsService', () => {
  let service: CompletedAppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompletedAppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
