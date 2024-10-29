import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-other-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './other-information.component.html',
  styleUrl: './other-information.component.css'
})
export class OtherInformationComponent {
  otherInformationFields = [
    { label: 'Special Skills/Hobbies', type: 'text' },
    { label: 'Non-Academic Distinctions/Recognition (Write in full)', type: 'text' },
    { label: 'Membership in Association/Organization (Write in full)', type: 'text' }
  ];
}

export class NgModule { }
