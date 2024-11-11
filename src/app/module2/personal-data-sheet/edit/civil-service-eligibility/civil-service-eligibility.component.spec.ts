import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilServiceEligibilityComponent } from './civil-service-eligibility.component';

describe('CivilServiceEligibilityComponent', () => {
  let component: CivilServiceEligibilityComponent;
  let fixture: ComponentFixture<CivilServiceEligibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CivilServiceEligibilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CivilServiceEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
