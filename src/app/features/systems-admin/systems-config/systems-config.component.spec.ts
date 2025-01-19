import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsConfigComponent } from './systems-config.component';

describe('SystemsConfigComponent', () => {
  let component: SystemsConfigComponent;
  let fixture: ComponentFixture<SystemsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemsConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
