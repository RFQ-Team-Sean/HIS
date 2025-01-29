import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormInputsComponent } from "../../../shared/form-inputs/form-inputs.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormInputsComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  @Input() slide!: boolean;
  @Output() toggleSlide = new EventEmitter<void>();
  header = 'Registration Form';  // Added a default header

  onToggleSlide() {
    this.toggleSlide.emit();
  }
}
