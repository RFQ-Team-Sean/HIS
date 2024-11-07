import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import 'flowbite'; // Import Flowbite JS
import { Datepicker } from 'flowbite';
import { SidebarNavigationModule } from '../sidebar-navigation/sidebar-navigation.module';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../Supabase/supabase.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
type ScheduleStatus = 'Pending' | 'Approved' | 'Rejected';

@Component({
  selector: 'app-leaves-attendance-records',
  standalone: true,
  imports: [SidebarNavigationModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './leaves-attendance-records.component.html',
  styleUrls: ['./leaves-attendance-records.component.css']
})
export class LeavesAttendanceRecordsComponent implements OnInit {
  @ViewChild('datePickerInput') datepickerInput!: ElementRef<HTMLInputElement>;

  leaveRequests: any[] = [];
  scheduleAdjustmentRequests: any[] = [];
  employees: any[] = [];
  
  leaveTypes: any[] = ['Sick Leave', 'Maternity Leave', 'Vacation Leave'];
  addLeaveForm: FormGroup;
  addSchedForm: FormGroup;
  selectedFile: File | null = null;
  selectedEmployeeId: number | null = null;
  selectedLeaveType: string | null = null;
  selectedStartDate: string | null = null;
  selectedEndDate: string | null = null;
  file: File | null = null;

  isManaging: boolean = false;
  isAdjusting: boolean = false;
  isAddSchedModalOpen: boolean = false;
  isAddLeaveModalOpen: boolean = false;
  
  adjustButtonText: string = 'Manage Requests';
  manageButtonText: string = 'Manage Requests';

  isModalOpen = false;
  isModalOpen2 = false; // For sched adjustment request
  isDeleteConfirmModalOpen = false;
  isSubmitting = false;
  selectedRequest: any = null;
  newStatus: LeaveStatus = 'Pending';
  newStatus2: ScheduleStatus = 'Pending';

  adjustLeaveAmount: number = 0;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService) {
    this.addLeaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      request: ['', Validators.required] // Field to store filename
    });

    this.addSchedForm = this.fb.group({
      employee_id: ['', Validators.required],
      request: ['', Validators.required], // Field to store filename
    });
  }

  async ngOnInit() {
    this.leaveRequests = await this.supabaseService.getLeaveRequests();
    for (const request of this.leaveRequests) {
      request.fileUrl = await this.supabaseService.getFileUrl(request.request, 'leave-requests-documents');
    }

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

  onManageButtonClick(){
    this.isManaging = !this.isManaging;
    this.manageButtonText = this.manageButtonText === 'Manage Requests' ? 'Stop Managing Requests' : 'Manage Requests'
  }

  onAdjustButtonClick(){
    this.isAdjusting = !this.isAdjusting;
    this.adjustButtonText = this.adjustButtonText === 'Manage Requests' ? 'Stop Managing Requests' : 'Manage Requests'
  }

  openModal(request: any) {
    this.selectedRequest = request;
    this.isModalOpen = true;
    this.newStatus = request.status;
  }

  openModal2(request: any) {
    this.selectedRequest = request;
    this.isModalOpen2 = true;
    this.newStatus2 = request.status;
  }

  openAddSchedModal() {
    this.isAddSchedModalOpen = true;
  }

  openAddLeaveModal() {
    this.isAddLeaveModalOpen = true;
  }
  
  openDeleteConfirmationModal() {
    this.isDeleteConfirmModalOpen = true;
  }

  closeDeleteConfirmationModal() {
      this.isDeleteConfirmModalOpen = false;
  }


  closeModal() {
    this.isModalOpen = false;
    this.selectedRequest = null;
  }

  closeModal2() {
    this.isModalOpen2 = false;
    this.selectedRequest = null;
  }

  closeAddSchedModal() {
    this.isAddSchedModalOpen = false;
    this.selectedEmployeeId = null;
    this.file = null;
  }

  closeAddLeaveModal() {
    this.isAddLeaveModalOpen = false;
    this.selectedEmployeeId = null;
    this.selectedLeaveType = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
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

  onUpdateClicked() {
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
        this.selectedRequest.status = this.newStatus;
        this.supabaseService.updateLeaveRequestStatus(this.selectedRequest.id, this.newStatus)
            .then(updatedData => {
                if (updatedData) {
                    console.log('Status updated in Supabase:', updatedData);
                } else {
                    console.error('Failed to update status in Supabase');
                }
            });
        this.closeModal()
    }
  }

  onUpdateClicked2() {
    if (this.selectedRequest) {
      this.selectedRequest.status = this.newStatus2;
      this.supabaseService.updateScheduleAdjustmentRequestStatus(this.selectedRequest.id, this.newStatus2)
        .then(updatedData => {
          if (updatedData) {
            console.log('Status updated in Supabase:', updatedData);
          } else {
            console.error('Failed to update status in Supabase');
          }
        });
      this.closeModal2();
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
        this.closeModal2();
    }
    this.scheduleAdjustmentRequests = await this.supabaseService.getScheduleAdjustmentRequests()
  }


  // ngAfterViewInit(): void {
  //   const datePicker = document.getElementById('default-datepicker');
  //   if(datePicker){
  //     const calendar = new Datepicker(datePicker);
  //     calendar.setDate(new Date());
  //     console.log("-----------------");
  //     console.log(calendar.getDate());
  //   }

  //   this.datepickerInput.nativeElement.addEventListener('blur', (event: Event) => {
  //     console.log('Date changed:', (event.target as HTMLInputElement).value);
  //   });
  // }


 // onDateChange(){
  //   console.log("-----------------");
  //   console.log("changed!")
  //   console.log("-----------------")
  // }
}
