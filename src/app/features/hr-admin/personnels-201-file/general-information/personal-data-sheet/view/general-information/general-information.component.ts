import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Field {
  label : string,
  type : string,
  value? : string, // dito ilagay input value ng field for backend
  defaultValue? : string,
  options? : string[],
  selectedOption? : string
}

@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css'
})
export class GeneralInformationComponent {
  // - PERSONAL INFORMATION -
  basicInformation: Field[] = [
    { label: 'First Name', type: 'text', defaultValue: 'John' },
    { label: 'Middle Name', type: 'text', defaultValue: 'Michael' },
    { label: 'Last Name', type: 'text', defaultValue: 'Doe' },
    { label: 'Name Extension', type: 'text', defaultValue: 'Jr.' },
    { label: 'Date of Birth', type: 'date', defaultValue: '1990-01-01' },
    { label: 'Place of Birth', type: 'text', defaultValue: 'Manila' },
    { label: 'Sex', type: 'boolean', options: ['Male', 'Female'], defaultValue: 'Male' },
    { label: 'Civil Status', type: 'dropdown', options: ['Single', 'Married', 'Widowed', 'Separated'], defaultValue: 'Single' },
    { label: 'Height', type: 'text', defaultValue: '5\'9"' },
    { label: 'Weight', type: 'text', defaultValue: '150 lbs' },
    { label: 'Blood Type', type: 'dropdown', options: ['A', 'B', 'AB', 'O'], defaultValue: 'O' }
  ];

  contactDetails: Field[] = [
    { label: 'Telephone No.', type: 'text', defaultValue: '(02) 123-4567' },
    { label: 'Mobile No.', type: 'text', defaultValue: '0917-123-4567' },
    { label: 'Email Address', type: 'text', defaultValue: 'johndoe@gmail.com' }
  ];

  govIdNos: Field[] = [
    { label: 'GSIS ID No.', type: 'text', defaultValue: '1234567890' },
    { label: 'PAG-IBIG ID No.', type: 'text', defaultValue: '9876543210' },
    { label: 'PhilHealth ID No.', type: 'text', defaultValue: 'PH-123456789' },
    { label: 'SSS No.', type: 'text', defaultValue: 'SSS-987654321' },
    { label: 'TIN No.', type: 'text', defaultValue: '123-456-789' },
    { label: 'Agency Employee No.', type: 'text', defaultValue: 'EMP123456' }
  ];

  addressDetails: Field[] = [
    { label: 'House/Block/Lot No.', type: 'text', defaultValue: '123' },
    { label: 'Street', type: 'text', defaultValue: 'Main St.' },
    { label: 'Subdivision/Village', type: 'text', defaultValue: 'Greenfields' },
    { label: 'Barangay', type: 'text', defaultValue: 'Barangay 123' },
    { label: 'City/Municipality', type: 'text', defaultValue: 'Quezon City' },
    { label: 'Province', type: 'text', defaultValue: 'Metro Manila' },
    { label: 'Zip Code', type: 'text', defaultValue: '1100' }
  ];

  // FAMILY BACKGROUND
  parentalInformation: Field[] = [
    { label: "Name", type: "text", defaultValue: 'Jane Doe' },
    { label: "Occupation", type: "text", defaultValue: 'Teacher' },
    { label: "Birthdate", type: "date", defaultValue: '1965-05-12' },
    { label: "Contact Number", type: "text", defaultValue: '0917-987-6543' },
    { label: "Address", type: "text", defaultValue: '123 Main St, Quezon City' },
    { label: "Marital Status of Parents", type: "dropdown", defaultValue: 'Married', options: ['Married', 'Separated', 'Divorced', 'Widowed'] }
  ];

  spousalInformation: Field[] = [
    { label: "Name", type: "text", defaultValue: 'Jane Smith' },
    { label: "Occupation", type: "text", defaultValue: 'Engineer' },
    { label: "Birthdate", type: "date", defaultValue: '1991-04-22' },
    { label: "Date of Marriage", type: "date", defaultValue: '2020-10-15' },
    { label: "Contact Number", type: "text", defaultValue: '0917-654-3210' },
    { label: "Address", type: "text", defaultValue: '456 Greenfield St, Makati' },
    { label: "Employer", type: "text", defaultValue: 'ABC Corp.' }
  ];

  emergencyContact: Field[] = [
    { label: "Contact Name", type: "text", defaultValue: 'Jane Smith' },
    { label: "Relationship to Contact", type: "dropdown", defaultValue: 'Spouse', options: ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other'] },
    { label: "Contact Number", type: "text", defaultValue: '0917-654-3210' },
    { label: "Contact Address", type: "text", defaultValue: '456 Greenfield St, Makati' }
  ];

  otherFamilyFields: Field[] = [
    { label: "Family Medical History", type: "text", defaultValue: 'None' },
    { label: "Living with Family?", type: "boolean", options : ['Yes', 'No'], defaultValue: 'Yes' },
    { label: "Any Deceased Family Members?", type: "boolean", options : ['Yes', 'No'], defaultValue: 'No' },
    { label: "Primary Family Language Spoken", type: "text", defaultValue: 'English' },
    { label: "Household Annual Income", type: "text", defaultValue: '500,000 PHP' }
  ];

  // EDUCATIONAL BACKGROUND
  schoolInfo: Field[] = [
    { label: 'Name of School', type: 'text', defaultValue: 'University of the Philippines' },
    { label: 'Degree/Course', type: 'text', defaultValue: 'BS Computer Science' },
    { label: 'Year Graduated', type: 'text', defaultValue: '2015' },
    { label: 'Highest Grade/Level/Units Earned', type: 'text', defaultValue: 'Bachelor\'s Degree' },
    { label: 'Scholarship', type: 'text', defaultValue: 'None' },
    { label: 'Academic Honors Received', type: 'text', defaultValue: 'Cum Laude' }
  ];

  // CIVIL SERVICE ELIGIBILITY
  civilServiceEligibilityInfo: Field[] = [
    { label: 'Career Service', type: 'text', defaultValue: 'Professional' },
    { label: 'Rating', type: 'text', defaultValue: '85.5' },
    { label: 'Date of Examination/Conferment', type: 'date', defaultValue: '2018-03-15' },
    { label: 'Place of Examination/Conferment', type: 'text', defaultValue: 'Quezon City' },
    { label: 'License Number', type: 'text', defaultValue: '123456' }, // Optional
    { label: 'Date of Validity', type: 'date', defaultValue: '2025-03-15' } // Optional
  ];

  // WORK EXPERIENCE
  workExperienceInformation: Field[] = [
    { label: 'Position Title', type: 'text', defaultValue: 'Software Developer' },
    { label: 'Department/Agency/Office/Company', type: 'text', defaultValue: 'ABC Corp.' },
    { label: 'Monthly Salary', type: 'text', defaultValue: '50,000' },
    { label: 'Salary Grade & Step Increment', type: 'text', defaultValue: 'N/A' }, // Optional for government positions
    { label: 'Status of Appointment', type: 'text', defaultValue: 'Permanent' },
    { label: 'Inclusive Dates (From)', type: 'date', defaultValue: '2020-01-01' },
    { label: 'Inclusive Dates (To)', type: 'date', defaultValue: '2023-12-31' },
    { label: 'Government Service', type: 'dropdown', options: ['Yes', 'No'], defaultValue: 'No' }
  ];

  // VOLUNTARY WORK
  voluntaryWorkDetails: Field[] = [
    { label: 'Name of Organization', type: 'text', defaultValue: 'Red Cross' },
    { label: 'Address of Organization', type: 'text', defaultValue: '123 Charity St, Quezon City' },
    { label: 'Inclusive Dates (From)', type: 'date', defaultValue: '2021-06-01' },
    { label: 'Inclusive Dates (To)', type: 'date', defaultValue: '2021-08-30' },
    { label: 'Number of Hours', type: 'text', defaultValue: '100' },
    { label: 'Position/Nature of Work', type: 'text', defaultValue: 'Volunteer' }
  ];

  // LEARNING AND DEVELOPMENT INTERVENTIONS
learningAndDevelopmentDetails: Field[] = [
  { label: 'Title of Learning and Development Intervention/Training Program', type: 'text', defaultValue: 'No Training Specified' },
  { label: 'Inclusive Dates of Attendance (From)', type: 'date', defaultValue: '2024-01-01' }, // Default date format
  { label: 'Inclusive Dates of Attendance (To)', type: 'date', defaultValue: '2024-12-31' },
  { label: 'Number of Hours', type: 'string', defaultValue: '0' }, // Default to 0 hours if none specified
  { label: 'Type of LD (Managerial/Technical/Etc.)', type: 'dropdown', options: ['Managerial', 'Technical', 'Supervisory', 'Foundational'], defaultValue: 'Technical' },
  { label: 'Conducted/Sponsored by', type: 'text', defaultValue: 'Not Provided' },
  { label: 'Certificate Given', type: 'dropdown', options: ['Yes', 'No'], defaultValue: 'No' }
];

// OTHER INFORMATION
otherInformationFields: Field[] = [
  { label: 'Special Skills/Hobbies', type: 'text', defaultValue: 'None' },
  { label: 'Non-Academic Distinctions/Recognition', type: 'text', defaultValue: 'None' },
  { label: 'Membership in Association/Organization', type: 'text', defaultValue: 'None' }
];



  // - FIELDSETS -
  fieldsets: { label: string, fields: Field[] }[] = [
    // Personal Information
    { label: 'Basic Information', fields: this.basicInformation },
    { label: 'Contact Details', fields: this.contactDetails },
    { label: 'Government Issued ID Nos', fields: this.govIdNos },
    { label: 'Current Address Details', fields: this.addressDetails },
    { label: 'Permanent Address Details', fields: this.addressDetails },
    // Family Background
    { label: 'Father Information', fields: this.parentalInformation },
    { label: 'Mother Information', fields: this.parentalInformation },
    { label: 'Spousal Information', fields: this.spousalInformation },
    { label: 'Emergency Contact Information', fields: this.emergencyContact },
    { label: 'Other Details', fields: this.otherFamilyFields },
    // Educational Background
    { label : 'Elementary', fields: this.schoolInfo },
    { label : 'Junior High School', fields: this.schoolInfo },
    { label : 'Senior High School', fields: this.schoolInfo },
    { label : 'Vocational/Trade Course', fields: this.schoolInfo },
    { label : 'College', fields: this.schoolInfo },
    { label : 'Graduate Studies', fields: this.schoolInfo },
    // Civil Service Eligibility
    { label : 'Civil Service Eligibility Information', fields: this.civilServiceEligibilityInfo },
    //  Work Experience
    { label : 'Work Experience Information', fields: this.workExperienceInformation },
    // Voluntary Work
    { label : 'Voluntary Work Information', fields: this.voluntaryWorkDetails },
    // Learningand Development Interventions
    { label : 'Learning Development and Intervention Information', fields: this.learningAndDevelopmentDetails },
    // Other Information
    { label : 'Other Information', fields: this.otherInformationFields },
  ];
}

export class NgModule { }
