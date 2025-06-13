import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuploginComponent } from './suplogin.component';

describe('SuploginComponent', () => {
  let component: SuploginComponent;
  let fixture: ComponentFixture<SuploginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuploginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuploginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
