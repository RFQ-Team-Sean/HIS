import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

interface Field {
  label : string,
  type : string,
  value? : string, // dito ilagay input value ng field for backend
  defaultValue? : string,
  options? : string[],
  selectedOption? : string
}

@Component({
  selector: 'app-educational-background',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule],
  templateUrl: './educational-background.component.html',
  styleUrl: './educational-background.component.css'
})
export class EducationalBackgroundComponent {
  date: Date | undefined;

  schoolInfo : Field[] = [
    { label: 'Name of School', type: 'text' },
    { label: 'Degree/Course', type: 'text', defaultValue: 'N/A if not applicable' },
    { label: 'Year Graduated', type: 'date' },
    { label: 'Highest Grade/Level/Units Earned', type: 'text' },
    { label: 'Scholarship (if any)', type: 'text' },
    { label: 'Academic Honors Received', type: 'text' }
  ];

  fieldsets = [
    { label : 'Elementary', fields: this.schoolInfo },
    { label : 'Junior High School', fields: this.schoolInfo },
    { label : 'Senior High School', fields: this.schoolInfo },
    { label : 'Vocational/Trade Course', fields: this.schoolInfo },
    { label : 'College', fields: this.schoolInfo },
    { label : 'Graduate Studies', fields: this.schoolInfo }
  ];
}



export class NgModule { }
