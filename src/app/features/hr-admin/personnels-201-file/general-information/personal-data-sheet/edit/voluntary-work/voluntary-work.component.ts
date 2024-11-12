import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-voluntary-work',
  standalone: true,
  imports: [CommonModule, CalendarModule, DropdownModule, FormsModule],
  templateUrl: './voluntary-work.component.html',
  styleUrl: './voluntary-work.component.css'
})
export class VoluntaryWorkComponent {
  date: Date | undefined;

  voluntaryWorkDetails = [
    { label: 'Name of Organization', type: 'text' },
    { label: 'Address of Organization', type: 'text' },
    { label: 'Inclusive Dates (From)', type: 'date' },
    { label: 'Inclusive Dates (To)', type: 'date' },
    { label: 'Number of Hours', type: 'text' },
    { label: 'Position/Nature of Work', type: 'text' }
  ];
}

export class NgModule { }
