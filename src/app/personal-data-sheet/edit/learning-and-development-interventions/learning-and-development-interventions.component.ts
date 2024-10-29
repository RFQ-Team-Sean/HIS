import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { GeneralInformationComponent } from '../../view/general-information/general-information.component';

interface Field {
  label : string,
  type : string,
  options? : string[],
  value?: string,
  defaultValue?: string
}

@Component({
  selector: 'app-learning-and-development-interventions',
  standalone: true,
  imports: [CommonModule, CalendarModule, DropdownModule, FormsModule, GeneralInformationComponent],
  templateUrl: './learning-and-development-interventions.component.html',
  styleUrl: './learning-and-development-interventions.component.css'
})
export class LearningAndDevelopmentInterventionsComponent {
  date: Date | undefined;

  learningAndDevelopmentDetails : Field[] = [
    { label: 'Title of Learning and Development Intervention/Training Program', type: 'text' },
    { label: 'Inclusive Dates of Attendance (From)', type: 'date' },
    { label: 'Inclusive Dates of Attendance (To)', type: 'date' },
    { label: 'Number of Hours', type: 'text' },
    { label: 'Type of LD', type: 'dropdown', options: ['Managerial', 'Technical', 'Supervisory', 'Foundational'] },
    { label: 'Conducted/Sponsored by', type: 'text' },
    { label: 'Certificate Given', type: 'boolean', options: ['Yes', 'No'] }
  ];

  isOpen: boolean = false; // Track whether the dropdown is open
  activeDropdownLabel: string | null = null; // Keep track of the active dropdown

  toggleDropdown(field: Field) {
    // If the clicked dropdown is already open, close it; otherwise, open it
    this.activeDropdownLabel = this.activeDropdownLabel === field.label ? null : field.label;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // If the click is not on a dropdown button or dropdown options, close the dropdown
    if (!target.closest('.dropdown-container')) {
      this.activeDropdownLabel = null; // Close the dropdown
    }
  }

  selectOption(field: Field, option: string) {
    field.value = option; // Set the selected option
    this.activeDropdownLabel = null; // Close the dropdown
  }
}

export class NgModule { }
