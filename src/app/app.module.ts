import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Injectable, NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginFailedComponent } from '../app/login-failed/login-failed.component';
import { SidebarNavigationComponent } from './sidebar-navigation/sidebar-navigation.component';
import { PDSComponent } from './pds/pds.component';

import { MeritsAndViolationsComponent } from './merits-and-violations/merits-and-violations.component';
// import { PersonalDataSheetComponent } from './personal-data-sheet/personal-data-sheet.component';
import { LoanInformationComponent } from './loan-information/loan-information.component';
import { PersonalInformationComponent } from './personal-data-sheet/edit/personal-information/personal-information.component';
import { FamilyBackgroundComponent } from './personal-data-sheet/edit/family-background/family-background.component';
import { EducationalBackgroundComponent } from './personal-data-sheet/edit/educational-background/educational-background.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';

import { LeavesAttendanceRecordsComponent } from './leaves-attendance-records/leaves-attendance-records.component';
import { RequestsComponent } from './requests/requests.component';


@NgModule({
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    DashboardComponent,
    LoginFailedComponent,
    SidebarNavigationComponent,
    PDSComponent,
    // PersonalDataSheetComponent,
    LoanInformationComponent,
    PersonalInformationComponent,
    FamilyBackgroundComponent,
    EducationalBackgroundComponent,
    BrowserAnimationsModule,
    MeritsAndViolationsComponent,
    LeavesAttendanceRecordsComponent,
    RequestsComponent,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
})
export class AppModule { }

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getBackendData() {
    this.http.get('http://your-backend-url/api/data')
     .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HRIS';
  passwordHidden: boolean = true;

  togglePasswordVisibility(): void {
    this.passwordHidden = !this.passwordHidden;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.passwordHidden ? 'password' : 'text';
  }
}
