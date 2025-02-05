import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRightsComponent } from './access-roles.component';

describe('AccessRolesComponent', () => {
  let component: AccessRightsComponent;
  let fixture: ComponentFixture<AccessRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
