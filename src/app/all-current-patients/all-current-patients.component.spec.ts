import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCurrentPatientsComponent } from './all-current-patients.component';

describe('AllCurrentPatientsComponent', () => {
  let component: AllCurrentPatientsComponent;
  let fixture: ComponentFixture<AllCurrentPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllCurrentPatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllCurrentPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
