import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { Subscription } from 'rxjs';
import { HostListener } from '@angular/core';

interface SidebarItem {
  name: string;
  route: string;
  icon?: string;
  subItems?: SidebarSubItem[];
  isExpanded?: boolean;
}

interface SidebarSubItem {
  name: string;
  route: string;
  isExpanded?: boolean;
  icon?: string;
  subItems?: SidebarSubItem[];
}
interface SidebarSubSubItem {
  name: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpanded = false;
  sidebarItems: SidebarItem[] = [];
  currentModuleSubscription: Subscription | undefined;
  currentModule: string = '';

  private routeIconMap: { [key: string]: string } = {
    // Admin routes
    '/admin/dashboard': 'dashboard',
    '/admin/user-management': 'manage_accounts',
    '/admin/user-management/users': 'person_add',
    '/admin/user-management/roles': 'admin_panel_settings',
    '/admin/user-management/access-rights': 'security',
    '/admin/user-management/password': 'password',
    '/admin/user-management/mfa-otp': 'key',
    '/admin/system-configuration': 'settings',
    '/admin/systems-config': 'tune',
    '/admin/systems-configuration/audit': 'fact_check',
    '/admin/approval-workflow': 'approval',
    '/admin/approval-workflow/process': 'workflow-approval',
    '/admin/approval-workflow/delegation': 'switch_account',
    '/admin/approval-workflow/oic': 'assignment_ind',
    '/admin/audit-trail': 'history',
    '/admin/system-integration': 'integration_instructions',

    // HR routes
    '/hr/dashboard': 'dashboard',
    '/hr/personnel-201-file': 'folder_shared',
    '/hr/personnel-201-file/general-info': 'person',
    '/hr/personnel-201-file/employment': 'work',
    '/hr/personnel-201-file/compensation': 'payments',
    '/hr/personnel-201-file/attendance': 'event_available',
    '/hr/personnel-201-file/requests': 'assignment',
    '/hr/personnel-201-file/movement': 'transfer_within_a_station',
    '/hr/personnel-201-file/loans': 'account_balance',
    '/hr/personnel-201-file/contributions': 'savings',
    '/hr/health-wellness': 'health_and_safety',
    '/hr/health-wellness/activities': 'directions_run',
    '/hr/health-wellness/medical': 'medical_services',
    '/hr/health-wellness/sick-leave': 'sick',
    '/hr/health-wellness/statistics': 'analytics',

    // Common routes
    '/support-ticket': 'support',
    '/dtr': 'schedule',
    '/workflow-approval': 'approval_delegation',
    '/merits-and-violations': 'grade',
    '/leaves-attendance-records': 'event_note',
    '/pimam': 'people',
    '/loan-information': 'account_balance_wallet',
    '/personal-data-sheet/view': 'description',
    '/payroll-processing': 'payments',
    '/government-tables': 'table_chart',
    '/deductions-allowances': 'calculate',
    '/time-attendance-data-processing': 'access_time',
    '/dtr-adjustments': 'edit_calendar',
    '/applicant-information': 'person_search',
    '/interview-examination-management': 'rate_review',
    '/appointment-processing': 'how_to_reg'
  };
  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    const storedModule = localStorage.getItem('currentModule');
    if (storedModule) {
      this.setSidebarItemsBasedOnModule(storedModule);
    }

    this.currentModuleSubscription = this.sidebarService.currentModule$.subscribe(module => {
      if (module) {
        this.currentModule = module;
        this.setSidebarItemsBasedOnModule(module);
        console.log('Current module:', module);
        console.log('Sidebar items:', this.sidebarItems);
      }
    });
  }

  ngOnDestroy(): void {
    this.currentModuleSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleSubMenu(item: SidebarItem): void {
    item.isExpanded = !item.isExpanded;
  }

  toggleSubSubMenu(subItem: SidebarSubItem): void {
    subItem.isExpanded = !subItem.isExpanded;
  }

  // Expand sidebar after a delay
  expandSidebar(): void {
    setTimeout(() => this.isExpanded = true, 100);
  }

  // Collapse sidebar after a delay
  collapseSidebar(): void {
    setTimeout(() => this.isExpanded = false, 100);
  }

  // Close sidebar when user clicks outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#sidebar') && this.isExpanded) {
      this.collapseSidebar();
    }
  }

   // Toggle sidebar on clicks inside
   @HostListener('click', ['$event'])
   onSidebarClick(event: MouseEvent): void {
     this.isExpanded = !this.isExpanded;
     event.stopPropagation(); // Prevent event from propagating to document listener
   }
   
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getIconForRoute(route: string): string {
    return this.routeIconMap[route] || 'circle';
  }


  setSidebarItemsBasedOnModule(module: string): void {
    switch (module) {
      case 'admin':
        this.sidebarItems = [
          { name: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
          {
            name: 'User Management',
            route: '/admin/user-management',
            icon: 'group',
            subItems: [
              { name: 'Create/Edit/Delete Users', route: '/admin/user-management' },
              { name: 'Role Management', route: '/admin/role-management' },
              { name: 'Access Rights', route: '/admin/access-roles' }
            ]
          },
          {
            name: 'System Configuration',
            route: '/admin/systems-config',
            icon: 'settings',
            subItems: [
              { name: 'Parameter Management', route: '/admin/systems-config' },
              { name: 'Audit Trail', route: '/admin/audit-trail' }
            ]
          },
          {
            name: 'Approval Workflow',
            route: '/admin/approval-workflow',
            icon: 'approval',
            subItems: [
              { name: 'Approval Process', route: '/admin/approval-workflow' },
              { name: 'Delegation of Authority', route: '/admin/workflow-approval-user' },
              { name: 'OIC Approval', route: '/admin/approval-workflow/oic' }
            ]
          }
        ];
        break;

      case 'hr':
        this.sidebarItems = [
          { name: 'Dashboard', route: '/hr/dashboard', icon: 'dashboard' },
          {
            name: 'Personnel 201 File',
            route: '/hr/personnel-201-file',
            icon: this.getIconForRoute('/hr/personnel-201-file'),
            subItems: [
              {
                name: 'General Information',
                route: '/hr/personnel-201-file/general-info',
                icon: 'person',
                subItems: [
                  { name: 'Personal Details', route: '/hr/personnel-201-file/general-info/personal-data-sheet/view' },
                  { name: 'Contact Information', route: '/hr/personnel-201-file/general-info/contact' },
                  { name: 'Family Background', route: '/hr/personnel-201-file/general-info/family' }
                ]
              },
              {
                name: 'Employment Records',
                route: '/hr/personnel-201-file/employment-records',
                icon: 'work',
                subItems: [
                  { name: 'Merits and Violations', route: '/hr/personnel-201-file/employment-records/merits&violations' },
                ]
              },
              { name: 'Compensation & Benefits', route: '/hr/personnel-201-file/compensation' },
              { name: 'Leaves & Attendance', route: '/hr/personnel-201-file/leaves-attendance-records',
                icon: 'event_note',
                subItems:[
                  { name: 'Daily Time Logs', route: '/hr/personnel-201-file/leaves-attendance-records/daily-time-logs' },
                  { name: 'Schedule Adjustment Requests', route: '/hr/personnel-201-file/leaves-attendance-records/schedule-adjustment-requests' },
                  { name: 'Employee Leave Balance', route: '/hr/personnel-201-file/leaves-attendance-records/employee-leave-balance' },
                ]
              },
              { name: 'Requests Management', icon: 'assignment', route: '/hr/personnel-201-file/requests' },
              { name: 'Personnel Movement', route: '/hr/personnel-201-file/movement' },
              { name: 'Loan Information', route: '/hr/personnel-201-file/loan-information' },
              { name: 'Additional Contributions', route: '/hr/personnel-201-file/contributions' }
            ]
          },
        ];
        break;

      // Add other cases similarly...
    }
  }
  async signOut(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.supabaseService.signOut();
      localStorage.removeItem('userRole');
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}



