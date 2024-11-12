import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Event, Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-personal-data-sheet',
  standalone: true,
  imports: [
    RouterLinkActive, 
    RouterOutlet,
    CommonModule,
    RouterLink
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],  // Fix styleUrl to styleUrls
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class EditPDSComponent implements OnInit, AfterViewInit {
  rootUrl = '/hr/personnel-201-file/general-info/personal-data-sheet/edit/'; // Add trailing slash

  sections = [
    { title: 'I. Personal Information', route: this.rootUrl + 'personal-information' },
    { title: 'II. Family Background', route: this.rootUrl + 'family-background' },
    { title: 'III. Educational Background', route: this.rootUrl + 'educational-background' },
    { title: 'IV. Civil Service Eligibility', route: this.rootUrl + 'civil-service-eligibility' },
    { title: 'V. Work Experience', route: this.rootUrl + 'work-experience' },
    { title: 'VI. Voluntary Work', route: this.rootUrl + 'voluntary-work' },
    { title: 'VII. Learning and Development Interventions', route: this.rootUrl + 'learning-and-development-interventions' },
    { title: 'VIII. Other Information', route: this.rootUrl + 'other-information' }
  ];

  currentStep: number = 1;
  progressBarWidth: string = '12.5%';
  previousUrl: string = '';
  currentUrl: string = '';
  nextUrl: string = '';
  viewUrl: string = '/hr/personnel-201-file/general-info/personal-data-sheet/view/general-information';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if we're at the root edit URL
    if (this.router.url === this.rootUrl.slice(0, -1)) {
      this.router.navigate([this.sections[0].route]);
    }

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
      this.updateProgressBarWidth(this.currentUrl);
      this.setPreviousUrl();
      this.setNextUrl();
    });
  }

  ngAfterViewInit(): void {
    // Remove the navigation from here as it's handled in ngOnInit
  }

  updateProgressBarWidth(url: string): void {
    const currentIndex = this.sections.findIndex(section => section.route === url);
    if (currentIndex !== -1) {
      this.currentStep = currentIndex + 1;
      this.progressBarWidth = `${((currentIndex + 1) * 12.5)}%`;
    }
  }

  setNextUrl(): void {
    const currentIndex = this.sections.findIndex(section => section.route === this.currentUrl);
    if (currentIndex !== -1 && currentIndex < this.sections.length - 1) {
      this.nextUrl = this.sections[currentIndex + 1].route;
    } else {
      this.nextUrl = '';
    }
  }

  setPreviousUrl(): void {
    const currentIndex = this.sections.findIndex(section => section.route === this.currentUrl);
    if (currentIndex > 0) {
      this.previousUrl = this.sections[currentIndex - 1].route;
    } else {
      this.previousUrl = '';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.toggle('hidden');
    }
  }
}