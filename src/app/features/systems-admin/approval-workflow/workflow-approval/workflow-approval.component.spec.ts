import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowApprovalComponent } from './workflow-approval.component'; // Correct path for the component

describe('WorkflowApprovalComponent', () => {
  let component: WorkflowApprovalComponent;
  let fixture: ComponentFixture<WorkflowApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowApprovalComponent], // Correct place for the component
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
