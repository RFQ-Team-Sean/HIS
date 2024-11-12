import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyBackgroundComponent } from './family-background.component';

describe('FamilyBackgroundComponent', () => {
  let component: FamilyBackgroundComponent;
  let fixture: ComponentFixture<FamilyBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyBackgroundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
