import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event, Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { CompensationRecordsComponent } from './compensation-records/compensation-records.component';

interface Field {
  label : string,
  type : string,
  value? : string, // dito ilagay input value ng field for backend
  defaultValue? : string,
  options? : string[],
  selectedOption? : string
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, GeneralInformationComponent, CompensationRecordsComponent],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'] // fix typo 'styleUrl'
})
export class ViewPDSComponent implements OnInit {
  currentUrl: string = '';

  editRootUrl: string = '/hr/personnel-201-file/general-info/personal-data-sheet/edit/';  // Add trailing slash
  viewRootUrl: string = '/hr/personnel-201-file/general-info/personal-data-sheet/view/';  // Add trailing slash
  editUrl: string = this.editRootUrl + 'personal-information';
  generalInfoUrl: string = this.viewRootUrl + 'general-information';
  compensationRecordsUrl: string = this.viewRootUrl + 'compensation-records';
  leavesAndAttendanceRecordsUrl: string = this.viewRootUrl + 'leaves-and-attendance-records';

  constructor(private router: Router) {
    this.currentUrl = router.url;
  }



  ngOnInit(): void {
    // Monitor route changes
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    // Only navigate if we're at the root view route
    if (this.router.url === this.viewRootUrl.slice(0, -1)) { // remove trailing slash for comparison
      this.router.navigate([this.generalInfoUrl]);
    }
  }

  navigateTo = (route: string) => this.router.navigate([route]);

  setTitle(currentUrl : string) {
    switch (currentUrl) {
      case this.generalInfoUrl:
        return 'General Information';
        break;
      case this.compensationRecordsUrl:
        return 'Compensation Records';
        break;
      case this.leavesAndAttendanceRecordsUrl:
        return 'Leaves and Attendance Records';
        break;
      default:
        return '';
        break;
    }
  }
}
