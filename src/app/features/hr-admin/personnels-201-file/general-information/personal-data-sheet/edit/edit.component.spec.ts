import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPDSComponent } from './edit.component';

describe('EditPDSComponent', () => {
  let component: EditPDSComponent;
  let fixture: ComponentFixture<EditPDSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPDSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
