import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarNavigationModule } from './../sidebar-navigation/sidebar-navigation.module';
import { SupabaseService } from '../Supabase/supabase.service';

// Interface defining the structure of an Attendance record
interface Attendance {
  id: number;
  name: string;
  status: string;
  schedule_in: string;
  schedule_out: string;
  clock_in: string;
  clock_out: string;
  OT_IN: string;
  OT_OUT: string;
  selected?: boolean;
}

@Component({
  selector: 'app-dtr',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarNavigationModule],
  templateUrl: './dtr.component.html',
  styleUrls: ['./dtr.component.css']
})
export class DtrComponent implements OnInit {
  public today: Date = new Date();
  public showPopup = false;
  public showTable = true;
  public isEdit = false;
  public isManageMode = false;
  public attendances: Attendance[] = [];
  public filteredAttendances: Attendance[] = [];
  public searchTerm = '';
  public message = '';
  public isError = false;
  public selectedAttendance: Attendance | null = null;
  public currentPage = 1;
  public itemsPerPage = 9;
  public totalPages = 1;
  public selectedDate: Date = new Date();
  public formattedDate: string = '';
  public showDateInput = false;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.loadAttendances();
    this.formatSelectedDate(); // Format the date on initialization
  }

  /**
   * Validate the selected date.
   * @param date - The date to validate.
   * @returns The validated date or null if invalid.
   */
  private validateDate(date: any): Date | null {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        this.showMessage('Invalid date selected', true);
        return null;
      }
      return parsedDate;
    }
    return date instanceof Date && !isNaN(date.getTime()) ? date : null;
  }
  // Format the selected date
  private formatSelectedDate(): void {
    const date = this.selectedDate;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    this.formattedDate = `${month}/${day}/${year}`;
  }
  // Handle changes to the selected date.  // Handles date change
  public onDateChange(event: any): void {
    this.selectedDate = new Date(event.target.value);
    this.formatSelectedDate();
    this.loadAttendances(); // Make sure this method is correctly filtering data based on the selected date
  }
  

  // Load attendance records based on the selected date.
  private async loadAttendances(): Promise<void> {
    try {
      const selectedDateString = this.selectedDate.toISOString().split('T')[0];
      this.attendances = await this.supabaseService.getAttendancesByDate(selectedDateString);
      this.filteredAttendances = this.attendances;
      this.applySearch();
    } catch (error) {
      this.showMessage('Error loading attendances', true);
      console.error('Error loading attendances:', error);
    }
  }

  // Apply search filter to attendance records.
  public applySearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredAttendances = this.attendances.filter(attendance => 
      attendance.name.toLowerCase().includes(term) || 
      attendance.status.toLowerCase().includes(term)
    );
    this.updatePagination();
  }

  /**
   * Format schedule times.
   * @param scheduleIn - Schedule in time.
   * @param scheduleOut - Schedule out time.
   * @returns Formatted schedule string.
   */
  public formatSchedule(scheduleIn: string, scheduleOut: string): string {
    return `${scheduleIn} - ${scheduleOut}`;
  }

  // Open the popup for adding or editing attendance.
  public openPopup(): void {
    this.isEdit = false;
    this.resetForm();
    this.showPopup = true;
  }

  // Close the popup and reset form fields.
  public closePopup(): void {
    this.showPopup = false;
    this.resetForm();
    this.selectedAttendance = null;
    this.isEdit = false;
  }

  // Reset the form fields.
  private resetForm(): void {
    this.selectedAttendance = {
      id: 0,
      name: '',
      status: '',
      schedule_in: '',
      schedule_out: '',
      clock_in: '',
      clock_out: '',
      OT_IN: '',
      OT_OUT: ''
    };
  }

  // Navigate to the audit trail page.
  public goToAuditTrail(): void {
    this.router.navigate(['/system-management']);
  }

  // Close the attendance table view.
  public closeTable(): void {
    this.showTable = false;
    this.searchTerm = '';
    this.filteredAttendances = this.attendances;
    this.isManageMode = false;
  }

  /**
   * Display a message to the user.
   * @param msg - The message to display.
   * @param isError - Whether the message is an error message.
   */
  private showMessage(msg: string, isError: boolean = false): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
      this.isError = false;
    }, 3000);
  }

  // Toggle manage mode.
  public toggleManageMode(): void {
    this.isManageMode = !this.isManageMode;
  }

  /**
   * Edit an attendance record.
   * @param attendance - The attendance record to edit.
   */
  public editAttendance(attendance: Attendance): void {
    this.isEdit = true;
    this.selectedAttendance = { ...attendance };
    this.showPopup = true;
  }

  // Update pagination details.
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAttendances.length / this.itemsPerPage);
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
  }

  /**
   * Retrieve the paginated attendance records.
   * @returns The paginated attendance records.
   */
  public get paginatedAttendances(): Attendance[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAttendances.slice(start, start + this.itemsPerPage);
  }

  // Navigate to the next page.
  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Navigate to the previous page.
  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // Placeholder function for saving or updating attendance.
  
  public async saveOrUpdateAttendance(): Promise<void> {
    // Implementation for saving or updating attendance
  }

  // Placeholder function for deleting selected attendances.
  public async deleteSelectedAttendances(): Promise<void> {

  // Implementation for deleting selected attendances
  }

  /**
   * Format time strings.
   * @param time - The time string to format.
   * @returns The formatted time string.
   */
  public formatTime(time: string | null): string {
    if (!time) return 'N/A';

    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    return date.toLocaleString('en-US', options);
  }

  // Toggle the date input visibility.
  public toggleDateInput(): void {
    this.showDateInput = !this.showDateInput;
  }
}
