import { Routes } from '@angular/router';

// Core Components
import { ADashboardComponent } from './features/systems-admin/dashboard/dashboard.component';
import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { UserManagementComponent } from './features/systems-admin/user-management/user-management.component';
import { RoleManagementComponent } from './features/systems-admin/role-management/role-management.component';
import { AccessRolesComponent } from './features/systems-admin/access-roles/access-roles.component';
import { WorkflowApprovalComponent } from './features/systems-admin/approval-workflow/workflow-approval/workflow-approval.component';
import { WorkflowApprovalUserComponent } from './features/systems-admin/approval-workflow/workflow-approval-user/workflow-approval-user.component';
import { ViewPDSComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/view/view.component';
import { GeneralInformationComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/view/general-information/general-information.component';
import { CompensationRecordsComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/view/compensation-records/compensation-records.component';
import { EditPDSComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/edit.component';
import { PersonalInformationComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/personal-information/personal-information.component';
import { FamilyBackgroundComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/family-background/family-background.component';
import { EducationalBackgroundComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/educational-background/educational-background.component';
import { CivilServiceEligibilityComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/civil-service-eligibility/civil-service-eligibility.component';
import { WorkExperienceComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/work-experience/work-experience.component';
import { VoluntaryWorkComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/voluntary-work/voluntary-work.component';
import { LearningAndDevelopmentInterventionsComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/learning-and-development-interventions/learning-and-development-interventions.component';
import { OtherInformationComponent } from './features/hr-admin/personnels-201-file/general-information/personal-data-sheet/edit/other-information/other-information.component';
import { LoanInformationComponent } from './features/hr-admin/personnels-201-file/loan-information/loan-information.component';
import { RequestsComponent } from './features/hr-admin/personnels-201-file/requests/requests.component';
import { MeritsAndViolationsComponent } from './features/hr-admin/personnels-201-file/employment-records/merits-and-violations/merits-and-violations.component';
import { DailyTimeLogsComponent } from './features/hr-admin/personnels-201-file/leaves-attendance-records/dtr/dtr.component';
import { ScheduleAdjustmentRequestsComponent } from './features/hr-admin/personnels-201-file/leaves-attendance-records/schedule-adjustment-requests/schedule-adjustment-requests.component';
import { EmployeeLeaveBalanceComponent } from './features/hr-admin/personnels-201-file/leaves-attendance-records/employee-leave-balance/employee-leave-balance.component';

// Feature Components
import { SystemsConfigComponent } from './features/systems-admin/systems-config/systems-config.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginLayoutComponent
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ADashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'role-management', component: RoleManagementComponent },
      { path: 'access-roles', component: AccessRolesComponent },
      // { path: 'system-configuration', component: SystemConfigurationComponent },
      { path: 'approval-workflow', component: WorkflowApprovalComponent },
      { path: 'workflow-approval-user', component: WorkflowApprovalUserComponent },
      // { path: 'audit-trail', component: AuditTrailComponent },
      // { path: 'system-integration', component: SystemIntegrationComponent }
    ]
  },
  {
    path: 'hr',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ADashboardComponent },
      { path: 'personnel-201-file/leaves-attendance-records',
        // component: LayoutComponent,
        children: [
          { path: '', redirectTo: 'daily-time-logs', pathMatch: 'full' }, // Add this
          { path: 'daily-time-logs', component: DailyTimeLogsComponent },
          { path: 'schedule-adjustment-requests', component: ScheduleAdjustmentRequestsComponent },
          { path: 'employee-leave-balance', component: EmployeeLeaveBalanceComponent },
        ]
      },
      { path: 'personnel-201-file/loan-information', component: LoanInformationComponent },
      { path: 'personnel-201-file/requests', component: RequestsComponent },
      {
        path: 'personnel-201-file/employment-records',
        // component: LayoutComponent,
        children: [
          { path: '', redirectTo: 'merits&violations', pathMatch: 'full' }, // Add this
          { path: 'merits&violations', component: MeritsAndViolationsComponent },
        ]
      },
      {
        path: 'personnel-201-file/general-info/personal-data-sheet/view',
        component: ViewPDSComponent,
        children: [
          { path: '', redirectTo: 'general-information', pathMatch: 'full' }, // Add this
          { path: 'general-information', component: GeneralInformationComponent },
          { path: 'compensation-records', component: CompensationRecordsComponent }
        ]
      },
      {
        path: 'personnel-201-file/general-info/personal-data-sheet/edit',
        component: EditPDSComponent,
        children: [
          { path: '', redirectTo: 'personal-information', pathMatch: 'full' },
          { path: 'personal-information', component: PersonalInformationComponent },
          { path: 'family-background', component: FamilyBackgroundComponent },
          { path: 'educational-background', component: EducationalBackgroundComponent },
          { path: 'civil-service-eligibility', component: CivilServiceEligibilityComponent },
          { path: 'work-experience', component: WorkExperienceComponent },
          { path: 'voluntary-work', component: VoluntaryWorkComponent },
          { path: 'learning-and-development-interventions', component: LearningAndDevelopmentInterventionsComponent },
          { path: 'other-information', component: OtherInformationComponent }
        ]
      }
    ]
  },
  // {
  //   path: 'employee',
  //   component: EmployeeSelfServiceComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'feedback-submission', component: FeedbackSubmissionComponent }
  //   ]
  // },
  // {
  //   path: 'payroll',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'payroll-processing', component: PayrollProcessingComponent },
  //     { path: 'government-tables', component: GovernmentTablesComponent },
  //     { path: 'deductions-allowances', component: DeductionsAllowancesComponent },
  //     { path: 'retroactive-pay', component: RetroactivePayComponent }
  //   ]
  // },
  // {
  //   path: 'time-attendance',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'time-attendance-data-processing', component: TimeAttendanceDataProcessingComponent },
  //     { path: 'dtr-adjustments', component: DtrAdjustmentsComponent }
  //   ]
  // },
  // {
  //   path: 'job-application',
  //   component: RegistrationLoginComponent,
  //   children: [
  //     { path: '', redirectTo: 'registration-login', pathMatch: 'full' },
  //     { path: 'registration-login', component: RegistrationLoginComponent },
  //     { path: 'job-openings', component: JobOpeningsComponent },
  //     { path: 'profile-management', component: ProfileManagementComponent },
  //     { path: 'application-status-tracking', component: ApplicationStatusTrackingComponent }
  //   ]
  // },
  // {
  //   path: 'recruitment',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'applicant-information', component: ApplicantInformationComponent },
  //     { path: 'interview-examination-management', component: InterviewExaminationManagementComponent },
  //     { path: 'appointment-processing', component: AppointmentProcessingComponent }
  //   ]
  // },
  // {
  //   path: 'learning-development',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'individual-development-plans', component: IndividualDevelopmentPlansComponent },
  //     { path: 'training-opportunities', component: TrainingOpportunitiesComponent },
  //     { path: 'scholarship-foreign-travel', component: ScholarshipForeignTravelComponent }
  //   ]
  // },
  // {
  //   path: 'rewards-recognition',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'award-nomination-recording', component: AwardNominationRecordingComponent }
  //   ]
  // },
  // {
  //   path: 'performance-management',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'performance-data-capture', component: PerformanceDataCaptureComponent },
  //     { path: 'competency-self-assessment', component: CompetencySelfAssessmentComponent },
  //     { path: 'monitoring-coaching-reports', component: MonitoringCoachingReportsComponent },
  //     { path: 'development-plan-review-approval', component: DevelopmentPlanReviewApprovalComponent }
  //   ]
  // },
  // {
  //   path: 'health-and-wellness',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'health-and-wellness-activities', component: HealthAndWellnessActivitiesComponent },
  //     { path: 'medical-services-supplies', component: MedicalServicesSuppliesComponent },
  //     { path: 'sick-leave-history', component: SickLeaveHistoryComponent },
  //     { path: 'health-statistics-demographics', component: HealthStatisticsDemographicsComponent }
  //   ]
  // },
  // {
  //   path: 'forms-workflow',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'workflow-management', component: WorkflowManagementComponent },
  //     { path: 'viewing-monitoring-tracking', component: ViewingMonitoringTrackingComponent }
  //   ]
  // },
  // {
  //   path: 'reports',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'regulatory-agency-forms', component: RegulatoryAgencyFormsComponent },
  //     { path: 'payslip-generation', component: PayslipGenerationComponent },
  //     { path: 'summary-reports', component: SummaryReportsComponent },
  //     { path: 'personnel-reports', component: PersonnelReportsComponent },
  //     { path: 'bank-reports', component: BankReportsComponent },
  //     { path: 'government-mandated-reports', component: GovernmentMandatedReportsComponent },
  //     { path: 'retroactive-pay-last-pay-separation-pay', component: RetroactivePayLastPaySeparationPayComponent },
  //     { path: 'payroll-expense-cost-center', component: PayrollExpenseCostCenterComponent },
  //     { path: 'certificate-contributions-deductions', component: CertificateContributionsDeductionsComponent }
  //   ]
  // },
  // {
  //   path: 'data-exchange',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'importation-excel-templates', component: ImportationExcelTemplatesComponent },
  //     { path: 'export-facility', component: ExportFacilityComponent }
  //   ]
  // },
  // {
  //   path: 'data-visualization',
  //   component: DashboardComponent,
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'real-time-dashboard', component: RealTimeDashboardComponent },
  //     { path: 'data-analytics-reports', component: DataAnalyticsReportsComponent }
  //   ]
  // },
  {
    path: '**', // Wildcard route
    redirectTo: '/login',
  },
];
