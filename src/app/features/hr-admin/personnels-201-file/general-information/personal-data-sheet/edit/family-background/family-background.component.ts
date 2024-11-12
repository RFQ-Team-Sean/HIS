import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

interface Field {
  label: string;
  type: string;
  value?: string;
  defaultValue?: string;
  options?: string[];
  selectedOption?: string;
}

@Component({
  selector: 'app-family-background',
  standalone: true,
  imports: [CommonModule, CalendarModule, DropdownModule, FormsModule],
  templateUrl: './family-background.component.html',
  styleUrls: ['./family-background.component.css'],
})
export class FamilyBackgroundComponent implements AfterViewInit {
  date: Date | undefined;

  ngAfterViewInit(): void {

  }

  // Your field definitions remain unchanged
  parentalInformation: Field[] = [
    { label: "Name", type: "text" },
    { label: "Occupation", type: "text" },
    { label: "Birthdate", type: "date" },
    { label: "Contact Number", type: "text" },
    { label: "Address", type: "text" },
    { label: "Marital Status of Parents", type: "dropdown",
      defaultValue: 'Select Status',
      options: ['Married', 'Separated', 'Divorced', 'Widowed'] }
  ];

  spousalInformation: Field[] = [
    { label: "Name", type: "text" },
    { label: "Occupation", type: "text" },
    { label: "Birthdate", type: "date" },
    { label: "Date of Marriage", type: "date" },
    { label: "Contact Number", type: "text" },
    { label: "Address", type: "text" },
    { label: "Employer", type: "text" }
  ];

  emergencyContact: Field[] = [
    { label: "Contact Name", type: "text" },
    { label: "Relationship to Contact", type: "dropdown", options: ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other'] },
    { label: "Contact Number", type: "text" },
    { label: "Contact Address", type: "text" }
  ];

  otherFamilyFields: Field[] = [
    { label: "Family Medical History", type: "text" },
    { label: "Living with Family?", type: "boolean", options: ['Yes', 'No'] },
    { label: "Any Deceased Family Members?", type: "boolean", options: ['Yes', 'No'] },
    { label: "Primary Family Language Spoken", type: "text" },
    { label: "Household Annual Income", type: "text" }
  ];

  fieldsets: { label: string, fields: Field[] }[] = [
    { label: 'Father Information', fields: this.parentalInformation },
    { label: 'Mother Information', fields: this.parentalInformation },
    { label: 'Spousal Information', fields: this.spousalInformation },
    { label: 'Emergency Contact Information', fields: this.emergencyContact },
    { label: 'Other Details', fields: this.otherFamilyFields },
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
