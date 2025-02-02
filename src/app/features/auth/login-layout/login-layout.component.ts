import { Component, ComponentRef, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginAttemptService } from 'src/app/services/login-attempt.service';
import { SubmitTicketComponent } from 'src/app/shared/submit-ticket/submit-ticket.component';
import { SidebarService } from 'src/app/services/sidebar.service';
import { SignupComponent } from "../signup/signup.component";
import { SigninComponent } from "../signin/signin.component";

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, SignupComponent, SigninComponent, FormsModule],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent {
  slide = false;
  
  slideInOut() {
    this.slide = !this.slide;
  }

  private router = inject(Router);
  private loginAttemptService = inject(LoginAttemptService);
  private sidebarService = inject(SidebarService);

  @ViewChild('popupHostContainer', { read: ViewContainerRef }) 
  popupHostContainerRef!: ViewContainerRef;
  
  popupComponentInstance!: ComponentRef<SubmitTicketComponent>;
  
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  displayCustomPopup(): void {
    this.popupHostContainerRef.clear();
    this.popupComponentInstance = this.popupHostContainerRef.createComponent(SubmitTicketComponent);
    this.popupComponentInstance.instance.close.subscribe(() => this.removeCustomPopup());
  }

  removeCustomPopup(): void {
    this.popupComponentInstance?.destroy();
  }

  async onSubmit(): Promise<void> {
    if (this.loginAttemptService.isAttemptsExhausted()) {
      await this.router.navigate(['/login-failed']);
      return;
    }

    if (this.validateForm()) {
      this.loginAttemptService.incrementLoginAttempts();
      await this.authenticateUser();
    }
  }

  private validateForm(): boolean {
    if (!this.email) {
      this.errorMessage = 'Email is required.';
      return false;
    }
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  private async authenticateUser(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('Authentication attempted!');

      this.errorMessage = '';
      this.loginAttemptService.resetLoginAttempts();

      // Redirect to the dashboard after successful login
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Authentication error:', error);
      this.handleLoginFailure('An error occurred during login. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  private handleLoginFailure(message: string): void {
    this.errorMessage = message;
  }

  submitTicket(): void {
    this.displayCustomPopup();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userRole');
  }

  async navigateToDashboard(): Promise<void> {
    try {
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = 'Error navigating to dashboard. Please try again.';
    }
  }

  onMouseMove(event: MouseEvent): void {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    
    const cursorGradient = document.querySelector('.cursor-gradient') as HTMLElement;
    if (cursorGradient) {
      cursorGradient.style.background = 
        `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.5), transparent 30%)`;
    }
  }
}
