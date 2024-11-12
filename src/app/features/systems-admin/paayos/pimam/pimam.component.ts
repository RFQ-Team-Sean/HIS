import { Component, AfterViewInit, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';  
import { SidebarNavigationModule } from '../sidebar-navigation/sidebar-navigation.module';
import 'flowbite'; // Import Flowbite JS
import { Datepicker, Modal } from 'flowbite';
import { SupabaseService } from '../Supabase/supabase.service';

// TEMPORARY INTERFACE. SHOULD FOLLOW AND MOVE TO /models
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

// records for each employee
interface AttendanceRecords {
  name: string;
  numPresent: number;
  numAbsent: number;
  numTardy: number;
  leaveCredits: number;
}

interface AttendanceTodayData {
  numPresent: number;
  numAbsent: number;
  numTardy: number;
}

interface Employee {
  email: string;
  firstName: string;
  middleName: string;
  surname: string;
  position: string;
  department: string;
  type: string;
}
@Component({
  selector: 'app-pimam',
  standalone: true,
  imports: [RouterModule, SidebarNavigationModule, CommonModule],
  templateUrl: './pimam.component.html',
  styleUrl: './pimam.component.css'
})
export class PimamComponent implements OnInit{
  
  
  public attendanceRecords: Attendance[] = [];
  public uniqueEmpAttendances: AttendanceRecords[] = [];
  public attendanceTodayData: AttendanceTodayData[] = [];
  public employees: Employee[] = [];
  public selectedDate: Date = new Date();
  public showPersonnelModal = false;
  public selectedRecord: Employee | null = null;

  constructor(private router: Router, private supabaseService: SupabaseService) {}


  ngOnInit(): void {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      await this.loadAttendances();
      await this.getTotalAttendanceToday();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  private async loadAttendances(): Promise<void> {
    
    try {
      var uniqueNames: string[] = [];
      //filters the attendance record based on the person logged in
      this.attendanceRecords = await this.supabaseService.getAttendances();
      this.attendanceRecords.forEach((records)=> {
        //get the unique emails
        if(!uniqueNames.includes(records.name)){
          uniqueNames.push(records.name);
        }
      });
      
      uniqueNames.forEach((name) => {
        this.uniqueEmpAttendances.push({name: name, numPresent: this.getPresentDays(name), numAbsent: this.getAbsentDays(name), numTardy: this.getTardyDays(name), leaveCredits: 5});
      })
    } catch (error) {
      console.error('Error loading attendances:', error);
    }
  }

  private getPresentDays(name: string): number {
    var daysPresent = 0;
    try{
      daysPresent = this.attendanceRecords.filter((record) => record.clock_in !== null && record.clock_out !== null && record.name === name).length;
    } catch (error) {
      console.error('Error loading attendances:', error);
    }
    return daysPresent;
  }

  private getAbsentDays(name: string): number {
    var daysAbsent = 0;
    try{
      daysAbsent = this.attendanceRecords.filter((record) => record.clock_in === null && record.clock_out === null && record.name === name).length;
    } catch (error) {
      console.error('Error loading attendances:', error);
    }
    return daysAbsent;
  }

  private getTardyDays(name: string): number {
    var daysTardy = 0;
    try{
      daysTardy = this.attendanceRecords.filter((record) => record.clock_in > record.schedule_in && record.name === name).length;
    } catch (error) {
      console.error('Error loading attendances:', error);
    }
    return daysTardy;
  }

  // Functions for getting the data regarding the attendance today

  private async getTotalAttendanceToday(): Promise<void> {
    try {
      const selectedDateString = this.selectedDate.toISOString().split('T')[0];
      this.attendanceRecords = await this.supabaseService.getAttendancesByDate(selectedDateString);
      this.employees = await this.supabaseService.getEmployeesTable();

      this.attendanceTodayData.push({numPresent: this.attendanceRecords.length, numAbsent: this.employees.length - this.attendanceRecords.length, numTardy: this.getTardyEmployees()});
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private getTardyEmployees(): number {
    var tardyEmployees = this.attendanceRecords.filter((record) => record.clock_in > record.schedule_in).length;
    return tardyEmployees;
  }

  personnelRowClicked(record: AttendanceRecords): void {
    this.selectedRecord = this.employees.find(empRecord => empRecord.email === record.name) || null;
    // this.router.navigate(['/personnel', employee.email]);
  }

  toggleModal(record: AttendanceRecords) {
    this.showPersonnelModal = !this.showPersonnelModal;
    if (this.showPersonnelModal) {
      this.personnelRowClicked(record);
    }
  }

  closeModal(){
    this.showPersonnelModal = !this.showPersonnelModal;
  }
}
