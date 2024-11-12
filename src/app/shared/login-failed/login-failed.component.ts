import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TicketService } from './ticket.service';

@Component({
  selector: 'app-login-failed',
  templateUrl: './login-failed.component.html',
  styleUrls: ['./login-failed.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [TicketService]
})
export class LoginFailedComponent {
  ticket = {
    title: 'Login Failed',
    email: '',
    description: ''
  };
  ticketSubmitted = false;
  submitError = '';
  submitSuccess = '';

  constructor(private ticketService: TicketService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.submitError = 'Please fill in all fields correctly.';
      return;
    }

    this.ticketService.submitTicket(this.ticket).subscribe(
      response => {
        console.log('Ticket submitted successfully:', response);
        this.ticketSubmitted = true;
        this.submitError = '';
        this.submitSuccess = 'Thank you for submitting your ticket. We will get back to you soon.';
        this.resetForm();
      },
      error => {
        console.error('Error submitting ticket:', error);
        this.submitError = 'An error occurred while submitting the ticket. Please try again.';
        this.submitSuccess = '';
      }
    );
  }

  resetForm() {
    this.ticket = {
      title: 'Login Failed',
      email: '',
      description: ''
    };
  }
}