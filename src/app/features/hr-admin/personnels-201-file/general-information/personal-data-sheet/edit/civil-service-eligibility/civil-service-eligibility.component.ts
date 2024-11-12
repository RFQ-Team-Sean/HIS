import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-civil-service-eligibility',
  standalone: true,
  imports: [CommonModule, CalendarModule, DropdownModule, FormsModule],
  templateUrl: './civil-service-eligibility.component.html',
  styleUrl: './civil-service-eligibility.component.css'
})
export class CivilServiceEligibilityComponent {
  date: Date | undefined;

  civilServiceEligibilityInfo = [
    { label: 'Career Service', type: 'text' },
    { label: 'Rating', type: 'text' }, // e.g., percentage or score
    { label: 'Date of Examination/Conferment', type: 'date' },
    { label: 'Place of Examination/Conferment', type: 'text' },
    { label: 'License Number', type: 'text' }, // Optional
    { label: 'Date of Validity', type: 'date' } // Optional
  ];
}

export class NgModule { }
