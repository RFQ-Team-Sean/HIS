import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveBalanceComponent } from './employee-leave-balance.component';

describe('EmployeeLeaveBalanceComponent', () => {
  let component: EmployeeLeaveBalanceComponent;
  let fixture: ComponentFixture<EmployeeLeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLeaveBalanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
