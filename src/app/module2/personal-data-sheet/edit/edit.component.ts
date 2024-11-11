import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Event, Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { SidebarNavigationModule } from 'src/app/sidebar-navigation/sidebar-navigation.module';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-personal-data-sheet',
  standalone: true,
  imports: [RouterLinkActive, RouterOutlet,
    SidebarNavigationModule, CommonModule,
    RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }), // Start off-screen
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 })), // Slide in
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })), // Slide out
      ]),
    ]),
  ],
})
export class EditPDSComponent implements AfterViewInit {
  date: Date | undefined;

  rootUrl = '/personal-data-sheet/edit/';

  sections = [
    { title: 'I. Personal Information', route: this.rootUrl + 'personal-information'},
    { title: 'II. Family Background', route: this.rootUrl + 'family-background'},
    { title: 'III. Educational Background', route: this.rootUrl + 'educational-background'},
    { title: 'IV. Civil Service Eligibility', route: this.rootUrl + 'civil-service-eligibility'},
    { title: 'V. Work Experience', route: this.rootUrl + 'work-experience'},
    { title: 'VI. Voluntary Work', route: this.rootUrl + 'voluntary-work'},
    { title: 'VII. Learning and Development Interventions', route: this.rootUrl + 'learning-and-development-interventions'},
    { title: 'VIII. Other Information', route: this.rootUrl + 'other-information'},
  ];

  // prepareRoute = (outlet: RouterOutlet) => { return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'] };

  constructor(private router: Router) {
    // this.currentUrl = router.url;
    router.navigate([this.sections[0].route])
  }

  ngAfterViewInit(): void {
    this.router.navigate([this.sections[0].route])
  }

  progressBarWidth: string = '0%'; // Default value

  currentStep : number = 0;

  previousUrl : string = "";
  currentUrl : string = "";
  nextUrl : string = "";
  viewUrl :string = 'personal-data-sheet/view/general-information';

  navigateTo = (route : string) => this.router.navigateByUrl(route);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateProgressBarWidth(event.urlAfterRedirects);
        this.currentUrl = event.urlAfterRedirects;
        this.setPreviousUrl();
        this.setNextUrl();
      });
  }

  updateProgressBarWidth(url: string): void {
    let currentUrlIndex : number = this.sections.findIndex(section => section.route === url);

    this.progressBarWidth = (currentUrlIndex + 1) * 12.5 + '%';
    console.log(this.progressBarWidth);
    this.currentStep = 8 * parseFloat(this.progressBarWidth.replace('%', '')) / 100;
  }

  setNextUrl() {
    // Find the index of the current section
    const currentIndex = this.sections.findIndex(section => section.route === this.currentUrl);

    // Navigate to the previous route if it exists
    if (currentIndex !== -1 && currentIndex < this.sections.length - 1) {
      this.nextUrl = this.sections[currentIndex + 1].route;
      console.log("nextURL changed!")
    }
  }

  setPreviousUrl() {
    // Find the index of the current section
    const currentIndex = this.sections.findIndex(section => section.route === this.currentUrl);

    // Navigate to the next route if it exists
    if (currentIndex >= 1 && currentIndex < this.sections.length) {
      this.previousUrl = this.sections[currentIndex - 1].route;
      console.log("previousURL changed!")
    }
  }

  toggleModal(modalId : string) {
    const modal = document.getElementById(modalId);

    if(modal) {
      modal.classList.toggle('hidden');
    }
  }
}
export class NgModule { }
