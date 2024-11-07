import { Component, OnInit } from '@angular/core';
import { SidebarNavigationModule } from '../sidebar-navigation/sidebar-navigation.module';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../Supabase/supabase.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

type ScheduleStatus = 'Pending' | 'Approved' | 'Rejected';

@Component({
  selector: 'app-leaves-attendance-records',
  standalone: true,
  imports: [SidebarNavigationModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './leaves-attendance-records.component.html',
  styleUrls: ['./leaves-attendance-records.component.css']
})
export class LeavesAttendanceRecordsComponent implements OnInit {

  scheduleAdjustmentRequests: any[] = [];
  employees: any[] = [];
  
  leaveTypes: any[] = ['Sick Leave', 'Maternity Leave', 'Vacation Leave'];
  addSchedForm: FormGroup;
  selectedFile: File | null = null;
  selectedEmployeeId: number | null = null;
  file: File | null = null;

  isAdjusting: boolean = false;
  isAddSchedModalOpen: boolean = false;
  
  adjustButtonText: string = 'Manage Requests';
  manageButtonText: string = 'Manage Requests';

  isManageSchedModalOpen = false; // For sched adjustment request
  isDeleteConfirmModalOpen = false;
  isSubmitting = false;
  selectedRequest: any = null;
  newStatus: ScheduleStatus = 'Pending';

  adjustLeaveAmount: number = 0;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService) {
    this.addSchedForm = this.fb.group({
      employee_id: ['', Validators.required],
      request: ['', Validators.required], // Field to store filename
    });
  }

  async ngOnInit() {

    this.scheduleAdjustmentRequests = await this.supabaseService.getScheduleAdjustmentRequests();
    for (const request of this.scheduleAdjustmentRequests) {
      request.fileUrl = await this.supabaseService.getFileUrl(request.request, 'schedule-adjustment-requests-documents');
    }
    console.log(this.scheduleAdjustmentRequests)

    this.loadEmployees();
  }

  async loadEmployees() {
        const { data, error } = await this.supabaseService.getProfilesForRequests();
        if (error) console.error('Error loading employees:', error);
        else this.employees = data;
  }

  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          this.file = file;
      }
  }

  onAdjustButtonClick(){
    this.isAdjusting = !this.isAdjusting;
    this.adjustButtonText = this.adjustButtonText === 'Manage Requests' ? 'Stop Managing Requests' : 'Manage Requests'
  }

  openManageSchedModal(request: any) {
    this.selectedRequest = request;
    this.isManageSchedModalOpen = true;
    this.newStatus = request.status;
  }

  openAddSchedModal() {
    this.isAddSchedModalOpen = true;
  }

  openDeleteConfirmationModal() {
    this.isDeleteConfirmModalOpen = true;
  }

  closeDeleteConfirmationModal() {
      this.isDeleteConfirmModalOpen = false;
  }

  closeManageSchedModal() {
    this.isManageSchedModalOpen = false;
    this.selectedRequest = null;
  }

  closeAddSchedModal() {
    this.isAddSchedModalOpen = false;
    this.selectedEmployeeId = null;
    this.file = null;
  }

  async onAddSchedSubmit() {
    if (!this.selectedEmployeeId || !this.file) return;

    this.isSubmitting = true;

    //Upload file to supabase bucket
    const filePath = `${Date.now()}_${this.file.name}`;
    const { error: uploadError } = await this.supabaseService.uploadRequestFile(
        'schedule-adjustment-requests-documents',
        filePath,
        this.file
    );

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        this.isSubmitting = false;
        return;
    }

    //Submit data to schedule_adjustment_requests table
    const { error: insertError } = await this.supabaseService.insertRequest({
        employee_id: this.selectedEmployeeId,
        request: filePath,
        status: 'Pending',
    }, 'schedule_adjustment_requests');

    this.scheduleAdjustmentRequests = await this.supabaseService.getScheduleAdjustmentRequests()

    if (insertError) {
        console.error('Error inserting schedule adjustment request:', insertError);
    } else {
        this.closeAddSchedModal();
    }

    this.isSubmitting = false;
  }


  onUpdateSchedClicked() {
    if (this.selectedRequest) {
      this.selectedRequest.status = this.newStatus;
      this.supabaseService.updateScheduleAdjustmentRequestStatus(this.selectedRequest.id, this.newStatus)
        .then(updatedData => {
          if (updatedData) {
            console.log('Status updated in Supabase:', updatedData);
          } else {
            console.error('Failed to update status in Supabase');
          }
        });
      this.closeManageSchedModal();
    }
  }

  async onDeleteConfirmed() {
    if (this.selectedRequest) {
        this.supabaseService.deleteScheduleAdjustmentRequest(this.selectedRequest.id, this.selectedRequest.request)
            .then(deleted => {
                if (deleted) {
                    console.log('Request and file deleted successfully:', deleted);
                } else {
                    console.log('Failed to delete request or file');
                }
            })
            .catch(error => console.error('Error during delete:', error));
        this.closeDeleteConfirmationModal();
        this.closeManageSchedModal();
    }
    this.scheduleAdjustmentRequests = await this.supabaseService.getScheduleAdjustmentRequests()
  }

}
