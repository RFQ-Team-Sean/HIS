import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, CalendarModule, DropdownModule, FormsModule],
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css'
})
export class WorkExperienceComponent {
  date: Date | undefined;

  workExperienceInformation = [
    { label: 'Position Title', type: 'text' },
    { label: 'Department/Agency/Office/Company', type: 'text' },
    { label: 'Monthly Salary', type: 'text' }, // e.g., in currency value
    { label: 'Salary Grade & Step Increment', type: 'text' }, // Optional for government positions
    { label: 'Status of Appointment', type: 'text' }, // e.g., Permanent, Temporary, Casual
    { label: 'Inclusive Dates (From)', type: 'date' },
    { label: 'Inclusive Dates (To)', type: 'date' },
    { label: 'Government Service', type: 'boolean', options: ['Yes', 'No'] }
  ];
}

export class NgModule { }
