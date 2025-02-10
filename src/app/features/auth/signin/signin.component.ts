import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { FormInputsComponent } from "../../../shared/form-inputs/form-inputs.component";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, FormInputsComponent],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  @Input() slide: boolean = false;
  @Output() toggleSlide = new EventEmitter<void>();

  email: string = '';
  password: string = '';

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async login() {
    try {
      // Log the email and password for debugging
      console.log('Email:', this.email);
      console.log('Password:', this.password);
  
      if (!this.email || !this.password) {
        alert('Please enter both email and password.');
        return;
      }
  
      const { data, error } = await this.supabaseService.signIn(this.email, this.password);
  
      if (error) {
        console.error('Authentication Error:', error.message);
        alert('Invalid credentials. Please try again.');
        return;
      }
  
      if (data && data.user) {
        localStorage.setItem('supabaseSession', JSON.stringify(data));
        this.router.navigate(['/admin/dashboard']);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  }

  onToggleSlide() {
    this.toggleSlide.emit();
  }
}