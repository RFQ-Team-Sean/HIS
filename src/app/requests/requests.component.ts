import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarNavigationModule } from '../sidebar-navigation/sidebar-navigation.module';
import { SupabaseService } from '../Supabase/supabase.service';

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [SidebarNavigationModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit{
  //Store Employee Data
  employees: any[] = [];

  //General
  selectedRequest: any = null;
  isSubmitting: boolean = false;

  //Leave Requests
  leaveRequests: any[] = [];
  addLeaveForm: FormGroup;
  leaveTypes: any[] = ['Sick Leave', 'Maternity Leave', 'Vacation Leave'];
  isManagingLeaves: boolean = false;
  isManageLeaveModalOpen: boolean = false;
  manageLeaveButtonText: String = 'Manage Requests';
  newLeaveStatus: LeaveStatus = 'Pending';
  adjustLeaveAmount: number = 0;

  //For adding leave requests
  isAddLeaveModalOpen = false;
  selectedFile: File | null = null;
  selectedEmployeeId: number | null = null;
  selectedLeaveType: string | null = null;
  selectedStartDate: string | null = null;
  selectedEndDate: string | null = null;
  file: File | null = null;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService){
    this.addLeaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      request: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.leaveRequests = await this.supabaseService.getLeaveRequests();
    for (const request of this.leaveRequests) {
      request.fileUrl = await this.supabaseService.getFileUrl(request.request, 'leave-requests-documents');
    }

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

  onManageButtonClick(requestType: String){
    if (requestType === "Leaves"){
      this.isManagingLeaves = !this.isManagingLeaves;
      this.manageLeaveButtonText = this.manageLeaveButtonText === 'Manage Requests' ? 'Stop Managing Requests' : 'Manage Requests'
    }
  }

  openManageRequestModal(requestType: String, request: any) {
    switch (requestType) {
      case 'Leaves':
        this.selectedRequest = request;
        this.isManageLeaveModalOpen = true;
        this.newLeaveStatus = request.status;
        break;
      default:
        break;
    }
  }

  openAddLeaveModal() {
    this.isAddLeaveModalOpen = true;
  }

  closeManageRequestModal(requestType: String){
    switch (requestType) {
      case 'Leaves':
        this.isManageLeaveModalOpen = false;
        break;
      default:
        break;
    }
  }

  closeAddLeaveModal() {
    this.isAddLeaveModalOpen = false;
    this.selectedEmployeeId = null;
    this.selectedLeaveType = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.file = null;
  }
  
  onUpdateLeaveClicked() {
    //update leave balance
    const newBalance = (this.selectedRequest.profile.leave_balance || 0) + this.adjustLeaveAmount;
    this.supabaseService.updateLeaveBalance(this.selectedRequest.profile?.user_id, newBalance)
      .then(updatedData => {
        if (updatedData) {
            console.log('Status updated in Supabase:', updatedData);
        } else {
            console.error('Failed to update status in Supabase');
        }
      });
    this.selectedRequest.profile.leave_balance = newBalance;
    this.adjustLeaveAmount = 0;
    //update request status
    if (this.selectedRequest) {
        this.selectedRequest.status = this.newLeaveStatus;
        this.supabaseService.updateLeaveRequestStatus(this.selectedRequest.id, this.newLeaveStatus)
            .then(updatedData => {
                if (updatedData) {
                    console.log('Status updated in Supabase:', updatedData);
                } else {
                    console.error('Failed to update status in Supabase');
                }
            });
        this.closeManageRequestModal('Leaves')
    }
  }

  async onAddLeaveSubmit() {
    if (!this.selectedEmployeeId || !this.file) return;

    this.isSubmitting = true;

    //Upload file to supabase bucket
    const filePath = `${Date.now()}_${this.file.name}`;
    const { error: uploadError } = await this.supabaseService.uploadRequestFile(
        'leave-requests-documents',
        filePath,
        this.file
    );

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        this.isSubmitting = false;
        return;
    }

    //Submit data to leave_requests table
    const { error: insertError } = await this.supabaseService.insertRequest({
        employee_id: this.selectedEmployeeId,
        leave_type: this.selectedLeaveType,
        request: filePath,
        start_date: this.selectedStartDate, 
        end_date: this.selectedEndDate,     
        status: 'Pending',
    }, 'leave_requests');


    this.leaveRequests = await this.supabaseService.getLeaveRequests()

    if (insertError) {
        console.error('Error inserting schedule adjustment request:', insertError);
    } else {
        this.closeAddLeaveModal();
    }

    this.isSubmitting = false;
  }

}
