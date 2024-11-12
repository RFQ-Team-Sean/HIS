import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/app/environments/environment';

interface Workflow {
  id: number;
  status: string;
  submitted_for: string;
  submitted_for_id: any;
  reviewer: string;
  request: string;
  requested_by: string;
  reviewer_id: any;
}

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './workflow-approval.component.html',
  styleUrls: ['./workflow-approval.component.css'],
})
export class WorkflowComponent implements OnInit {
  private supabase: SupabaseClient;
  workflows: Workflow[] = [];
  filteredWorkflows: Workflow[] = [];
  paginatedWorkflows: Workflow[] = [];
  selectedStatus: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  trackById(index: number, workflow: Workflow): number {
    return workflow.id;
  }

  async ngOnInit() {
    await this.fetchWorkflows();
  }

  async fetchWorkflows() {
    const { data, error } = await this.supabase
      .from('workflow')
      .select('id, status, submitted_for, submitted_for_id, reviewer, request, requested_by, reviewer_id');

    if (error) {
      console.error('Error fetching workflows:', error);
    } else {
      this.workflows = data?.map(item => ({
        id: item.id,
        status: item.status,
        submitted_for: item.submitted_for,
        submitted_for_id: item.submitted_for_id,
        reviewer: item.reviewer,
        request: item.request,
        requested_by: item.requested_by,
        reviewer_id: item.reviewer_id,
      })) || [];
      this.filterWorkflows();
    }
  }

  filterWorkflows() {
    this.filteredWorkflows = this.workflows.filter(workflow => {
      const matchesStatus = !this.selectedStatus || workflow.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm || 
        Object.values(workflow).some(value => 
          value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    });
    this.totalPages = Math.ceil(this.filteredWorkflows.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedWorkflows();
  }

  updatePaginatedWorkflows() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedWorkflows = this.filteredWorkflows.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredWorkflows.length / this.itemsPerPage);
  }

  async previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedWorkflows();
    }
  }

  async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedWorkflows();  
    }
  }

  goBack() {
    this.router.navigate(['/system-management']);
  }

  onStatusChange() {
    this.fetchWorkflows();
  }

  onSearchChange() {
    this.fetchWorkflows();
  }

  viewWorkflowDetails(workflowId: number) {
    console.log('View details for workflow:', workflowId);
    // Implement navigation to workflow details page if needed
  }

  approveWorkflow(workflowId: number) {
    console.log('Approve workflow:', workflowId);
    // Implement approval logic
  }

  rejectWorkflow(workflowId: number) {
    console.log('Reject workflow:', workflowId);
    // Implement rejection logic
  } 
}