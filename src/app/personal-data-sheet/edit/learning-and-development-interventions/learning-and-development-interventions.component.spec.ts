import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningAndDevelopmentInterventionsComponent } from './learning-and-development-interventions.component';

describe('LearningAndDevelopmentInterventionsComponent', () => {
  let component: LearningAndDevelopmentInterventionsComponent;
  let fixture: ComponentFixture<LearningAndDevelopmentInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningAndDevelopmentInterventionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LearningAndDevelopmentInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
