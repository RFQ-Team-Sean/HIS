import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ADashboardComponent implements OnInit {
  isExpanded = false;
  userEmail: string = ''; // Declare userEmail
  totalEmployees: string = '0'; // Add this line to store total employees as a string
  hasTimedIn: boolean = false; // Property to track if user has timed in

  viewDate: Date = new Date();
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  daysInMonth: number[] = [];
  daysInPrevMonth: number[] = [];
  daysInNextMonth: number[] = [];
  firstDayOfMonth: number = 0;
  message = '';
  isError = false;
  holidays: any[] = [];

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.fetchUserEmail();
    await this.fetchDashboardData();
    await this.checkTimeInStatus();
    await this.fetchHolidays(); // Make sure this line is present
    this.generateCalendar();
    this.updateCurrentDateTime(); // Start updating the current date and time
  }

  currentDateTime: string = this.getCurrentDateTime();


  getCurrentDateTime(): string {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = now.toLocaleTimeString();
    return `${date} | ${time}`;
  }

  sortDirection: 'none' | 'asc' | 'desc' = 'none';
  currentSorting(): string {
    switch (this.sortDirection) {
      case 'asc':
        return 'Ascending';
      case 'desc':
        return 'Descending';;
      default:
        return 'Default';
    }
  }

  isDropdownOpen : boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
    // Listen for document clicks to handle dropdown and modal visibility
      onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // Close the dropdown if the click is outside the dropdown menu and button
        if (!target.closest('#dropdown-menu') && !target.closest('#dropdown-button') && this.isDropdownOpen) {
          this.toggleDropdown();
        }
      }

  updateCurrentDateTime() {
    setInterval(() => {
      this.currentDateTime = this.getCurrentDateTime();
    }, 1000);
  }

  metrics: { label: string, value: number }[] = [];

  generateCalendar() {
    this.daysInMonth = [];
    this.daysInPrevMonth = [];
    this.daysInNextMonth = [];

    // Get the first day of the current month
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfMonth = firstDay.getDay();

    // Get the number of days in the current month
    const totalDaysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Get the number of days in the previous month
    const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    // Fill in the days of the previous month
    for (let i = daysInPrevMonth - this.firstDayOfMonth + 1; i <= daysInPrevMonth; i++) {
      this.daysInPrevMonth.push(i);
    }

    // Fill in the days of the current month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      this.daysInMonth.push(i);
    }

    // Fill in the days of the next month
    const totalDaysToFill = 42 - (this.daysInPrevMonth.length + totalDaysInMonth);
    for (let i = 1; i <= totalDaysToFill; i++) {
      this.daysInNextMonth.push(i);
    }
  }

  changeMonth(offset: number) {
    this.currentMonth += offset;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  isToday(day: number, month: number, year: number): boolean {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  }

  async fetchDashboardData() {
    try {
      const response = await this.supabaseService.getEmployees();
      if (!response.error) {
        const totalEmployees = response.data.length.toString(); // Convert to string
        this.totalEmployees = totalEmployees;
      } else {
        console.error('Error fetching employees:', response.error.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }

  async checkTimeInStatus() {
    try {
      if (!this.userEmail) {
        throw new Error('User email not available');
      }
      this.hasTimedIn = await this.supabaseService.hasTimedInToday(this.userEmail);
    } catch (error) {
      console.error('Error checking time in status:', error);
      this.hasTimedIn = false; // Default to false if there's an error
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  expandSidebar() {
    setTimeout(() => {
      this.isExpanded = true;
    }, 100);
  }

  collapseSidebar() {
    setTimeout(() => {
      this.isExpanded = false;
    }, 300);
  }

  getIconForRoute(route: string): string {
    switch (route) {
      case '/dashboard': return 'dashboard';
      case '/user-management': return 'group';
      case '/system-management': return 'settings';
      case '/payroll': return 'attach_money';
      case '/performance': return 'trending_up';
      case '/recruitment': return 'person_add';
      case '/reports': return 'assessment';
      default: return 'circle';
    }
  }

  async fetchUserEmail() {
    try {
      const { data: { user }, error: userError } = await this.supabaseService.getUser();
      if (userError) {
        console.error('User authentication error:', userError.message);
        throw userError;
      }
      if (!user || !user.email) {
        throw new Error('No authenticated user found or email is missing');
      }

      console.log('Fetched user email:', user.email);
      this.userEmail = user.email!; // Use non-null assertion operator
    } catch (error) {
      console.error('Error fetching user email:', error);
      this.userEmail = ''; // Set to empty string if there's an error
    }
  }

  async timeIn() {
    try {
      const name = this.userEmail;

      if (!name) {
        throw new Error('User email not available');
      }

      // Check if the user has already timed in today
      const hasTimedIn = await this.supabaseService.hasTimedInToday(name);
      if (hasTimedIn) {
        alert('You have already timed in today. You can only time in once per day.');
        return;
      }

      const status = 'Time In';
      const result = await this.supabaseService.insertDTRRecord(status, name);
      console.log('Time In recorded successfully:', result);
      alert('Time In recorded successfully');
      this.hasTimedIn = true; // Update the status after successful time in
    } catch (error) {
      console.error('Error recording Time In:', error);
      if (error instanceof Error) {
        alert(`Error recording Time In: ${error.message}`);
      } else {
        alert('Error recording Time In. Please try again.');
      }
    }
  }

  async timeOut() {
    try {
      const name = this.userEmail;

      if (!name) {
        throw new Error('User email not available');
      }

      const result = await this.supabaseService.updateDTRClockOut(name);
      if (result.error) {
        throw result.error;
      }
      console.log('Time Out recorded successfully:', result.data);
      alert('Time Out recorded successfully');
      this.hasTimedIn = false; // Update the status after successful time out
    } catch (error) {
      console.error('Error recording Time Out:', error);
      if (error instanceof Error) {
        alert(`Error recording Time Out: ${error.message}`);
      } else {
        alert('Error recording Time Out. Please try again.');
      }
    }
  }

  async loadParameters() {
    try {
      const data = await this.supabaseService.getParameters();
      // The data is already sorted by the Supabase query, so we don't need to sort it again
      console.log('Parameters loaded successfully:', data);
    } catch (error) {
      console.error('Error loading parameters:', error);
      this.showMessage('Failed to load parameters', true);
    }
  }

  showMessage(msg: string, isError: boolean = false) {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
      this.isError = false;
    }, 3000);
  }

  async fetchHolidays() {
    try {
      const allHolidays = await this.supabaseService.getHolidays();
      console.log('All fetched holidays:', allHolidays);

      const currentMonth = new Date().getMonth();
      this.holidays = allHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.parameter_date);
        return holidayDate.getMonth() === currentMonth;
      });

      console.log('Holidays for current month:', this.holidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  }

// REQUESTS

}

