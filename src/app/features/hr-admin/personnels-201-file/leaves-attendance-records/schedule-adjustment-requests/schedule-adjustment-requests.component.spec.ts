import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAdjustmentRequestsComponent } from './schedule-adjustment-requests.component';

describe('ScheduleAdjustmentRequestsComponent', () => {
  let component: ScheduleAdjustmentRequestsComponent;
  let fixture: ComponentFixture<ScheduleAdjustmentRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAdjustmentRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleAdjustmentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
