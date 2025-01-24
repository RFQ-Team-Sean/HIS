import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRolesComponent } from './access-roles.component';

describe('AccessRolesComponent', () => {
  let component: AccessRolesComponent;
  let fixture: ComponentFixture<AccessRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
