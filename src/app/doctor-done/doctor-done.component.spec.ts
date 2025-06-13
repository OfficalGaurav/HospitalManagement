import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDoneComponent } from './doctor-done.component';

describe('DoctorDoneComponent', () => {
  let component: DoctorDoneComponent;
  let fixture: ComponentFixture<DoctorDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
