import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesAttendanceRecordsComponent } from './leaves-attendance-records.component';

describe('LeavesAttendanceRecordsComponent', () => {
  let component: LeavesAttendanceRecordsComponent;
  let fixture: ComponentFixture<LeavesAttendanceRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesAttendanceRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavesAttendanceRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
