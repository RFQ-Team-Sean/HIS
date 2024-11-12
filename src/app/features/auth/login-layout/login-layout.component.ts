import { Component, ComponentRef, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginAttemptService } from 'src/app/services/login-attempt.service';
import { SubmitTicketComponent } from 'src/app/shared/submit-ticket/submit-ticket.component';
import { SidebarService } from 'src/app/services/sidebar.service';

interface ModuleRoute {
  path: string;
  label: string;
  role: string;
}

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent {
  private router = inject(Router);
  private loginAttemptService = inject(LoginAttemptService);
  private sidebarService = inject(SidebarService); // Inject SidebarService

  @ViewChild('popupHostContainer', { read: ViewContainerRef }) 
  popupHostContainerRef!: ViewContainerRef;
  
  popupComponentInstance!: ComponentRef<SubmitTicketComponent>;
  
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  protected readonly modules: ModuleRoute[] = [
    {
      path: 'admin',
      label: 'Admin',
      role: 'admin',
    },
    {
      path: 'hr',
      label: 'HR',
      role: 'hr',
    },
    {
      path: 'employee',
      label: 'Employee',
      role: 'employee',
    },
    {
      path: 'payroll',
      label: 'Payroll',
      role: 'payroll',
    },
    {
      path: 'time-attendance',
      label: 'Time & Attendance',
      role: 'time-attendance',
    },
    {
      path: 'recruitment',
      label: 'Recruitment',
      role: 'recruitment',
    },
    // ... add other modules similarly
  ];

  protected readonly mockUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'hr@example.com', password: 'hr123', role: 'hr' },
    { email: 'employee@example.com', password: 'employee123', role: 'employee' },
    { email: 'payroll@example.com', password: 'payroll123', role: 'payroll' },
    { email: 'time-attendance@example.com', password: 'time123', role: 'time-attendance' },
    { email: 'recruitment@example.com', password: 'recruitment123', role: 'recruitment' }
  ];

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
      const user = this.mockUsers.find(u => 
        u.email === this.email && u.password === this.password
      );

      if (!user) {
        this.handleLoginFailure('Invalid email or password. Please try again.');
        return;
      }

      console.log('User authenticated!');
      this.errorMessage = '';
      this.loginAttemptService.resetLoginAttempts();
      localStorage.setItem('userRole', user.role);

      // Set the user role in the SidebarService
      this.sidebarService.setCurrentModule(user.role); // <-- Add this line
      console.log('User role set in SidebarService:', user.role);

      const targetModule = this.modules.find(m => m.role === user.role);
      if (targetModule) {
        await this.router.navigate([`/${targetModule.path}/dashboard`]);
      } else {
        await this.router.navigate([`/${user.role}/dashboard`]);
      }
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

  getModulesForRole(): ModuleRoute[] {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return [];
    
    if (userRole === 'admin') {
      return this.modules;
    }
    
    return this.modules.filter(module => module.role === userRole);
  }

  async navigateToModule(path: string): Promise<void> {
    try {
      // Set the current module before navigation
      this.sidebarService.setCurrentModule(path);
      localStorage.setItem('currentModule', path); // Store current module
      await this.router.navigate([`/${path}/dashboard`]);
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = 'Error navigating to module. Please try again.';
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