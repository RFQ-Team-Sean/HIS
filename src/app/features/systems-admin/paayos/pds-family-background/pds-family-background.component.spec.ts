import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdsFamilyBackgroundComponent } from './pds-family-background.component';

describe('PdsFamilyBackgroundComponent', () => {
  let component: PdsFamilyBackgroundComponent;
  let fixture: ComponentFixture<PdsFamilyBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdsFamilyBackgroundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdsFamilyBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
