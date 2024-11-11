import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDataSheetComponent } from './edit.component';

describe('PersonalDataSheetComponent', () => {
  let component: PersonalDataSheetComponent;
  let fixture: ComponentFixture<PersonalDataSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDataSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDataSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
