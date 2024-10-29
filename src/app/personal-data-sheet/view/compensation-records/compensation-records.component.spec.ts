import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationRecordsComponent } from './compensation-records.component';

describe('CompensationRecordsComponent', () => {
  let component: CompensationRecordsComponent;
  let fixture: ComponentFixture<CompensationRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompensationRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompensationRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
