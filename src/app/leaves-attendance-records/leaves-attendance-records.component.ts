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
  
  addLeaveForm: FormGroup;
  addSchedForm: FormGroup;
  selectedFile: File | null = null;
  selectedEmployeeId: number | null = null;
  file: File | null = null;

  isManaging: boolean = false;
  isAdjusting: boolean = false;
  isAddSchedModalOpen: boolean = false;
  isAddLeaveModalOpen: boolean = false;

  adjustButtonText: string = 'Manage Requests';
  manageButtonText: string = 'Manage Requests';

  isModalOpen = false;
  isModalOpen2 = false; // For sched adjustment request
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
  }


  async onAddSchedSubmit() {
    if (!this.selectedEmployeeId || !this.file) return;

    this.isSubmitting = true;

    // Step 1: Upload file to Supabase Storage
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

    // Step 2: Submit data to schedule_adjustment_requests table
    const { error: insertError } = await this.supabaseService.insertScheduleAdjustmentRequest({
        employee_id: this.selectedEmployeeId,
        request: filePath,
        status: 'Pending',
    });

    if (insertError) {
        console.error('Error inserting schedule adjustment request:', insertError);
    } else {
        this.closeAddSchedModal(); // Close modal after successful submission
    }

    this.isSubmitting = false;
  }

  onUpdateClicked() {
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
      this.closeModal();
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
