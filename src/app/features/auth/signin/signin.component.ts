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
  @Input() slide: boolean = false;
  @Output() toggleSlide = new EventEmitter<void>();

  email: string = '';
  password: string = '';

  constructor(private router: Router) {} 

  login() {
    // Redirect to the admin dashboard
    this.router.navigate(['/admin/dashboard']);
  }

  onToggleSlide() {
    this.toggleSlide.emit();
  }
}
