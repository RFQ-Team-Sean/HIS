import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PDSComponent } from './pds.component';

describe('PDSComponent', () => {
  let component: PDSComponent;
  let fixture: ComponentFixture<PDSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PDSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
