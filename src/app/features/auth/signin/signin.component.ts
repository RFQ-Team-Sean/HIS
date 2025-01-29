import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormInputsComponent } from "../../../shared/form-inputs/form-inputs.component";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormInputsComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
login() {
throw new Error('Method not implemented.');
}
  @Input() slide: boolean = false;
  @Output() toggleSlide = new EventEmitter<void>();
  header = 'Registration Form';  // Added a default header
  isLoginClicked: boolean | undefined;

  constructor(private router: Router) {} // Inject Router here
 

  onToggleSlide() {
    this.toggleSlide.emit();
  }
}
