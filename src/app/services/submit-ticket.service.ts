import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private supabaseUrl = 'https://vhmftufkipgbxmcimeuq.supabase.co/rest/v1';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobWZ0dWZraXBnYnhtY2ltZXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MDExODAsImV4cCI6MjAzNTQ3NzE4MH0.7bzTx5n4SpXA1Go9kCRfgsxUIpK8j68vM-hIpVKJcnw';

  constructor(private http: HttpClient) {}

  submitTicket(ticket: any): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    });

    console.log('Submitting ticket to Supabase:', ticket);
    console.log('Headers:', headers);

    return this.http.post(
      `${this.supabaseUrl}/ticket`,
      ticket,
      { headers: headers, observe: 'response' }
    ).pipe(
      map(response => {
        console.log('Full HTTP response:', response);
        if (response.status === 201) {
          return response.body;
        } else {
          console.error('Unexpected status code:', response.status);
          return null;
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP error:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError('Something went wrong; please try again later.');
  }
}
