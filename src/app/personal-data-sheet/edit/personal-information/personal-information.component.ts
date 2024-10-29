import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import 'flowbite'; // Import Flowbite JS
import { Datepicker } from 'flowbite';


interface Field {
  label : string,
  type : string,
  options? : string[],
  value?: string,
  value2?: string,
  defaultValue?: string
}

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [DropdownModule, CommonModule],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.css'
})
export class PersonalInformationComponent implements AfterViewInit {
  date: Date | undefined;
  civil_status: string = '';

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
    this.disableDropdown('single Citizenship', 'Citizenship-dualDropdown');
  }


  basicInformation: Field[] = [
    { label: 'First Name', type: 'text' },
    { label: 'Middle Name', type: 'text' },
    { label: 'Last Name', type: 'text' },
    { label: 'Name Extension', type: 'text' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Place of Birth', type: 'text' },
    { label: 'Sex', type: 'boolean', options: ['Male', 'Female'] },
    { label: 'Civil Status', type: 'dropdown', options: ['Single', 'Married', 'Widowed', 'Separated'] },
    { label: 'Citizenship', type: 'hybrid', options: ['Filipino', 'American', 'Chinese', 'Bumbai', 'Nigger'] },
    { label: 'Height', type: 'text' },
    { label: 'Weight', type: 'text' },
    { label: 'Blood Type', type: 'dropdown', options: ['A', 'B', 'AB', 'O'] },
  ];

  contactDetails: Field[] = [
    { label: 'Telephone No.', type: 'text' },
    { label: 'Mobile No.', type: 'text' },
    { label: 'Email Address', type: 'text' }
  ];

  govIdNos: Field[] = [
    { label: 'GSIS ID No.', type: 'text' },
    { label: 'PAG-IBIG ID No.', type: 'text' },
    { label: 'PhilHealth ID No.', type: 'text' },
    { label: 'SSS No.', type: 'text' },
    { label: 'TIN No.', type: 'text' },
    { label: 'Agency Employee No.', type: 'text' }
  ];

  addressDetails: Field[] = [
    { label: 'House/Block/Lot No.', type: 'text' },
    { label: 'Street', type: 'text' },
    { label: 'Subdivision/Village', type: 'text' },
    { label: 'Barangay', type: 'text' },
    { label: 'City/Municipality', type: 'text' },
    { label: 'Province', type: 'text' },
    { label: 'Zip Code', type: 'text' }
  ];

  fieldsets: { label: string, fields: Field[] }[] = [
    { label: 'Basic Information', fields: this.basicInformation },
    { label: 'Contact Details', fields: this.contactDetails },
    { label: 'Government Issued ID Nos', fields: this.govIdNos },
    { label: 'Current Address Details', fields: this.addressDetails },
    { label: 'Permanent Address Details', fields: this.addressDetails },
  ];



  constructor() {
  }

  disableDropdown(radioId: string, dropdownId: string) {
    const radioButton = document.getElementById(radioId) as HTMLInputElement;
    const dropdownButton = document.getElementById(dropdownId) as HTMLSelectElement | HTMLButtonElement;

    // dropdownButton.classList.toggle('bg-gray-200');
    // dropdownButton.classList.toggle('bg-gray-50');
    // dropdownButton.classList.toggle('hover:bg-gray-100');

    console.log('disableDropdown() called!', radioButton.id, dropdownButton.id)
    dropdownButton.disabled = radioButton.checked;
    if (radioButton && dropdownButton) {
      if(dropdownButton.disabled) {
        dropdownButton.classList.add('bg-gray-200');
        dropdownButton.classList.remove('bg-gray-50', 'hover:bg-gray-100');
      }
      else {
        dropdownButton.classList.remove('bg-gray-200');
        dropdownButton.classList.add('bg-gray-50', 'hover:bg-gray-100');
      }
    this.activeDropdownLabel = null;
    }
  }


  ngOnInit() {

  }

  activeDropdownLabel: string | null = null; // Keep track of the active dropdown

  toggleDropdown(field: Field, dropdownId? : string) {
    // If the clicked dropdown is already open, close it; otherwise, open it
    if(field.label === 'Citizenship') {
      if(dropdownId === field.label+'-single') {
        this.activeDropdownLabel = this.activeDropdownLabel !== field.label+'-single' ? field.label+'-single' : null;
      }
      else if(dropdownId === field.label+'-dual') {
        this.activeDropdownLabel = this.activeDropdownLabel !== field.label+'-dual' ? field.label+'-dual' : null;
      }
      return;
    }
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

  selectOption(field: Field, option: string, dropdownId? : string) {
    if(field.label === 'Citizenship') {
      if(dropdownId === field.label+'-single') {
        field.value = option;
      }
      else if(dropdownId === field.label+'-dual') {
        field.value2 = option;
      }
      this.activeDropdownLabel = null;
      return;
    }

    field.value = option; // Set the selected option
    this.activeDropdownLabel = null; // Close the dropdown
  }
}

export class NgModule { }
