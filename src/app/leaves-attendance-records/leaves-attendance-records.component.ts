import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import 'flowbite'; // Import Flowbite JS
import { Datepicker } from 'flowbite';
@Component({
  selector: 'app-leaves-attendance-records',
  standalone: true,
  imports: [],
  templateUrl: './leaves-attendance-records.component.html',
  styleUrl: './leaves-attendance-records.component.css'
})
export class LeavesAttendanceRecordsComponent implements AfterViewInit {
  @ViewChild('datePickerInput') datepickerInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    const datePicker = document.getElementById('default-datepicker');
    if(datePicker){
      const calendar = new Datepicker(datePicker);
      calendar.setDate(new Date());
      console.log("-----------------");
      console.log(calendar.getDate());
    }

    this.datepickerInput.nativeElement.addEventListener('blur', (event: Event) => {
      console.log('Date changed:', (event.target as HTMLInputElement).value);
    });
  }

  onDateChange(){
    console.log("-----------------");
    console.log("changed!")
    console.log("-----------------")
  }
}
