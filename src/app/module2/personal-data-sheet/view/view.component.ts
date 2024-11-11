import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event, Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarNavigationModule } from 'src/app/sidebar-navigation/sidebar-navigation.module';

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
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, SidebarNavigationModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'] // fix typo 'styleUrl'
})
export class ViewPDSComponent implements OnInit {


  currentUrl: string = '';

  editRootUrl : string = '/personal-data-sheet/edit/';
  viewRootUrl : string = '/personal-data-sheet/view/';
  editUrl : string = this.editRootUrl + 'personal-information';
  generalInfoUrl = this.viewRootUrl + 'general-information';
  compensationRecordsUrl = this.viewRootUrl + 'compensation-records';
  leavesAndAttendanceRecordsUrl = this.viewRootUrl + 'leaves-and-attendance-records';

  constructor(private router: Router) {
    this.currentUrl = router.url;
  }


  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.router.navigate([this.generalInfoUrl]);
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
