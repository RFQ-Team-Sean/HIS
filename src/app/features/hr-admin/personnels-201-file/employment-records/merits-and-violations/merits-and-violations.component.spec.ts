import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeritsAndViolationsComponent } from './merits-and-violations.component';

describe('MeritsAndViolationsComponent', () => {
  let component: MeritsAndViolationsComponent;
  let fixture: ComponentFixture<MeritsAndViolationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeritsAndViolationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeritsAndViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
