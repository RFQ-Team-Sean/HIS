import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidedrawerConfigComponent } from './sidedrawer-config.component';

describe('SidedrawerConfigComponent', () => {
  let component: SidedrawerConfigComponent;
  let fixture: ComponentFixture<SidedrawerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidedrawerConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidedrawerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
