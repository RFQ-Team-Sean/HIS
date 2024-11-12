import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPDSComponent } from './view.component';

describe('ViewPDSComponent', () => {
  let component: ViewPDSComponent;
  let fixture: ComponentFixture<ViewPDSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPDSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
