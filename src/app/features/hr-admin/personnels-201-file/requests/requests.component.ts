import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/Supabase/supabase.service';

type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit{
  //Store Employee Data
  employees: any[] = [];

  //General
  selectedRequest: any = null;
  isSubmitting: boolean = false;

  //Requests
  requests: any[] = [];
  addRequestForm: FormGroup;
  requestTypes: any[] = ['Leave Request', 'Overtime Request', 'DTR Adjustment Request', 'Certifications', 'Membership Forms', 'Monetization of Leave Credits'];
  isManagingLeaves: boolean = false;
  isManageLeaveModalOpen: boolean = false;
  manageLeaveButtonText: String = 'Manage Requests';
  newLeaveStatus: RequestStatus = 'Pending';

  //For adding requests
  isAddLeaveModalOpen = false;
  selectedFile: File | null = null;
  selectedEmployeeId: number | null = null;
  selectedRequestType: string | null = null;
  file: File | null = null;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService){
    this.addRequestForm = this.fb.group({
      requestType: ['', Validators.required],
      request: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.requests = await this.supabaseService.getRequests();
    for (const request of this.requests) {
      request.fileUrl = await this.supabaseService.getFileUrl(request.request, 'requests-documents');
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
      this.manageLeaveButtonText = this.manageLeaveButtonText === 'Manage' ? 'Stop Managing' : 'Manage'
    }
  }

  openManageRequestModal(request: any) {
    this.selectedRequest = request;
    this.isManageLeaveModalOpen = true;
    this.newLeaveStatus = request.status;
  }

  openAddLeaveModal() {
    this.isAddLeaveModalOpen = true;
  }

  closeManageRequestModal(){
    this.isManageLeaveModalOpen = false;
  }

  closeAddRequestModal() {
    this.isAddLeaveModalOpen = false;
    this.selectedEmployeeId = null;
    this.selectedRequestType = null;
    this.file = null;
  }
  
  onUpdateClicked() {
    //update request status
    if (this.selectedRequest) {
        this.selectedRequest.status = this.newLeaveStatus;
        this.supabaseService.updateRequestStatus(this.selectedRequest.id, this.newLeaveStatus)
            .then(updatedData => {
                if (updatedData) {
                    console.log('Status updated in Supabase:', updatedData);
                } else {
                    console.error('Failed to update status in Supabase');
                }
            });
        this.closeManageRequestModal()
    }
  }

  async onAddRequestSubmit() {
    if (!this.selectedEmployeeId || !this.file) return;

    this.isSubmitting = true;

    //Upload file to supabase bucket
    const filePath = `${Date.now()}_${this.file.name}`;
    const { error: uploadError } = await this.supabaseService.uploadRequestFile(
        'requests-documents',
        filePath,
        this.file
    );

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        this.isSubmitting = false;
        return;
    }

    //Submit data to requests table
    const { error: insertError } = await this.supabaseService.insertRequest({
        employee_id: this.selectedEmployeeId,
        request_type: this.selectedRequestType,
        request: filePath, 
        status: 'Pending',
    }, 'requests');


    this.requests = await this.supabaseService.getRequests()

    if (insertError) {
        console.error('Error inserting schedule adjustment request:', insertError);
    } else {
        this.closeAddRequestModal();
    }

    this.isSubmitting = false;
  }

}
