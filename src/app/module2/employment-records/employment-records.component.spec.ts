import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentRecordsComponent } from './employment-records.component';

describe('EmploymentRecordsComponent', () => {
  let component: EmploymentRecordsComponent;
  let fixture: ComponentFixture<EmploymentRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmploymentRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
