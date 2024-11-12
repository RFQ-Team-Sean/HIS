import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PimamComponent } from './pimam.component';

describe('PimamComponent', () => {
  let component: PimamComponent;
  let fixture: ComponentFixture<PimamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PimamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PimamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
