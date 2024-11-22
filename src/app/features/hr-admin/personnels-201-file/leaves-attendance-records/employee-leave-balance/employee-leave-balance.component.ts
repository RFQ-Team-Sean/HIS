import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-leave-balance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-leave-balance.component.html',
  styleUrl: './employee-leave-balance.component.css'
})
export class EmployeeLeaveBalanceComponent implements OnInit {
  //Data
  profiles: any[] = [];
  filteredProfiles: any[] = []; 
  selectedProfile: any = null;
  adjustLeaveAmount: number = 0;

  //Booleans and Strings
  manageButtonText: string = 'Manage'
  isManaging: boolean = false;
  isManageModalOpen: boolean = false;

  //For Pagination and Search Function
  pageSize: number = 10; 
  totalPages: number = 1;
  searchTerm: string = '';
  currentPage: number = 1; 
  paginatedProfiles: any[] = [];
  

  constructor(private supabaseService: SupabaseService){

  }

  async ngOnInit() {
    const { data: profiles, error } = await this.supabaseService.getProfiles();
    if (error) {
      console.error('Error fetching profiles:', error);
      this.profiles = [];
    } else {
      this.profiles = profiles || [];
      this.filteredProfiles = [...this.profiles]; 
    }

    this.totalPages = Math.ceil(this.filteredProfiles.length / this.pageSize); 
    this.paginatedProfiles = this.getPaginatedProfiles(); 
  }

  selectProfile(profile: any) {
    this.selectedProfile = profile;
  }

  onManageButtonClick(){
    this.isManaging = !this.isManaging;
    this.manageButtonText = this.manageButtonText === 'Manage' ? 'Stop Managing' : 'Manage';
  }

  searchTable() {
    if (this.searchTerm.trim() === '') {
      this.filteredProfiles = this.profiles; 
    } else {
      this.filteredProfiles = this.profiles.filter(profile =>
        profile.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        profile.surname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.filteredProfiles.length / this.pageSize);
    this.paginatedProfiles = this.getPaginatedProfiles(); 
  }

  onSortOptionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'asc') {
      this.filteredProfiles.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (value === 'desc') {
      this.filteredProfiles.sort((a, b) => b.first_name.localeCompare(a.first_name));
    } else {
      this.filteredProfiles = [...this.profiles]; 
    }
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.filteredProfiles.length / this.pageSize);
    this.paginatedProfiles = this.getPaginatedProfiles(); 
  }

  onUpdateClicked() {
    const newBalance = (this.selectedProfile.leave_balance || 0) + this.adjustLeaveAmount;
    this.supabaseService.updateLeaveBalance(this.selectedProfile.user_id, newBalance)
      .then(updatedData => {
        if (updatedData) {
            console.log('Status updated in Supabase:', updatedData);
            this.selectedProfile.leave_balance = newBalance;
            this.adjustLeaveAmount = 0;
            this.closeManageModal();
        } else {
            console.log('Failed to update status in Supabase');
        }
      });
  }

  getPaginatedProfiles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProfiles.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedProfiles = this.getPaginatedProfiles(); 
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginatedProfiles = this.getPaginatedProfiles(); 
    }
  }
  
  openManageModal(user: any){
    this.isManageModalOpen = true;
    this.selectedProfile = user;
  }

  closeManageModal(){
    this.isManageModalOpen = false;
    this.adjustLeaveAmount = 0;
  }


}
