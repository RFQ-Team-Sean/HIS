import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../Supabase/supabase.service';

interface SidebarItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-sidebar-navigation',
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.css']
})
export class SidebarNavigationComponent {
  isExpanded = false;

  // sidebar buttons
  sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Daily Time Logs', route: '/dtr' },
    { name: 'Personal Data Sheet', route: '/personal-data-sheet/view'},
    { name: 'Loan Information', route: '/loan-information'},
    { name: 'Merits and Violations', route: '/merits-and-violations'},
    { name: 'Leaves and Attendance Records', route: '/leaves-attendance-records'},

  ];

  private routeIconMap: { [key: string]: string } = {
    '/dashboard': 'dashboard',
    '/dtr': 'today',
    '/support-ticket': 'contact_support',
    '/merits-and-violations' : 'list',
    '/leaves-attendance-records': 'perm_contact_calendar',
    '/loan-information': 'account_balance',
    '/personal-data-sheet/view' : 'account_circle'
  };

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  expandSidebar = () => setTimeout(() => this.isExpanded = true, 100);

  collapseSidebar = () => setTimeout(() => this.isExpanded = false, 300);

  navigateTo = (route: string) => this.router.navigate([route]);

  getIconForRoute = (route: string): string => this.routeIconMap[route] || 'circle';

  async signOut(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.supabaseService.signOut();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
