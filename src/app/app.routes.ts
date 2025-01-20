import { Routes } from '@angular/router';

// Core Components
import { ADashboardComponent } from './features/systems-admin/dashboard/dashboard.component';
import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { UserManagementComponent } from './features/systems-admin/user-management/user-management.component';
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
// import { UserManagementComponent } from './features/systems-administration/user-management/user-management.component';
// import { SystemConfigurationComponent } from './features/systems-administration/system-configuration/system-configuration.component';
// import { ApprovalWorkflowComponent } from './features/systems-administration/approval-workflow/approval-workflow.component';
// import { AuditTrailComponent } from './features/systems-administration/audit-trail/audit-trail.component';
// import { SystemIntegrationComponent } from './features/systems-administration/system-integration/system-integration.component';

// import { Personnel201FileComponent } from './features/hr-administration/personnel-201-file/personnel-201-file.component';
// import { RecruitmentComponent } from './features/hr-administration/recruitment/recruitment.component';
// import { HealthAndWellnessComponent } from './features/hr-administration/health-and-wellness/health-and-wellness.component';

// import { EmployeeSelfServiceComponent } from './features/employee-self-service/employee-self-service.component';
// import { FeedbackSubmissionComponent } from './features/employee-self-service/feedback-submission/feedback-submission.component';

// import { PayrollProcessingComponent } from './features/payroll-management/payroll-processing/payroll-processing.component';
// import { GovernmentTablesComponent } from './features/payroll-management/government-tables/government-tables.component';
// import { DeductionsAllowancesComponent } from './features/payroll-management/deductions-allowances/deductions-allowances.component';
// import { RetroactivePayComponent } from './features/payroll-management/retroactive-pay/retroactive-pay.component';

// import { TimeAttendanceDataProcessingComponent } from './features/time-attendance-management/time-attendance-data-processing/time-attendance-data-processing.component';
// import { DtrAdjustmentsComponent } from './features/time-attendance-management/dtr-adjustments/dtr-adjustments.component';

// import { RegistrationLoginComponent } from './features/job-application-portal/registration-login/registration-login.component';
// import { JobOpeningsComponent } from './features/job-application-portal/job-openings/job-openings.component';
// import { ProfileManagementComponent } from './features/job-application-portal/profile-management/profile-management.component';
// import { ApplicationStatusTrackingComponent } from './features/job-application-portal/application-status-tracking/application-status-tracking.component';

// import { ApplicantInformationComponent } from './features/recruitment-selection-placement/applicant-information/applicant-information.component';
// import { InterviewExaminationManagementComponent } from './features/recruitment-selection-placement/interview-examination-management/interview-examination-management.component';
// import { AppointmentProcessingComponent } from './features/recruitment-selection-placement/appointment-processing/appointment-processing.component';

// import { IndividualDevelopmentPlansComponent } from './features/learning-development/individual-development-plans/individual-development-plans.component';
// import { TrainingOpportunitiesComponent } from './features/learning-development/training-opportunities/training-opportunities.component';
// import { ScholarshipForeignTravelComponent } from './features/learning-development/scholarship-foreign-travel/scholarship-foreign-travel.component';

// import { AwardNominationRecordingComponent } from './features/rewards-recognition/award-nomination-recording/award-nomination-recording.component';

// import { PerformanceDataCaptureComponent } from './features/performance-management/performance-data-capture/performance-data-capture.component';
// import { CompetencySelfAssessmentComponent } from './features/performance-management/competency-self-assessment/competency-self-assessment.component';
// import { MonitoringCoachingReportsComponent } from './features/performance-management/monitoring-coaching-reports/monitoring-coaching-reports.component';
// import { DevelopmentPlanReviewApprovalComponent } from './features/performance-management/development-plan-review-approval/development-plan-review-approval.component';

// import { HealthAndWellnessActivitiesComponent } from './features/health-and-wellness/health-and-wellness-activities/health-and-wellness-activities.component';
// import { MedicalServicesSuppliesComponent } from './features/health-and-wellness/medical-services-supplies/medical-services-supplies.component';
// import { SickLeaveHistoryComponent } from './features/health-and-wellness/sick-leave-history/sick-leave-history.component';
// import { HealthStatisticsDemographicsComponent } from './features/health-and-wellness/health-statistics-demographics/health-statistics-demographics.component';

// import { WorkflowManagementComponent } from './features/forms-workflow/workflow-management/workflow-management.component';
// import { ViewingMonitoringTrackingComponent } from './features/forms-workflow/viewing-monitoring-tracking/viewing-monitoring-tracking.component';

// import { RegulatoryAgencyFormsComponent } from './features/reports/regulatory-agency-forms/regulatory-agency-forms.component';
// import { PayslipGenerationComponent } from './features/reports/payslip-generation/payslip-generation.component';
// import { SummaryReportsComponent } from './features/reports/summary-reports/summary-reports.component';
// import { PersonnelReportsComponent } from './features/reports/personnel-reports/personnel-reports.component';
// import { BankReportsComponent } from './features/reports/bank-reports/bank-reports.component';
// import { GovernmentMandatedReportsComponent } from './features/reports/government-mandated-reports/government-mandated-reports.component';
// import { RetroactivePayLastPaySeparationPayComponent } from './features/reports/retroactive-pay-last-pay-separation-pay/retroactive-pay-last-pay-separation-pay.component';
// import { PayrollExpenseCostCenterComponent } from './features/reports/payroll-expense-cost-center/payroll-expense-cost-center.component';
// import { CertificateContributionsDeductionsComponent } from './features/reports/certificate-contributions-deductions/certificate-contributions-deductions.component';

// import { ImportationExcelTemplatesComponent } from './features/data-exchange/importation-excel-templates/importation-excel-templates.component';
// import { ExportFacilityComponent } from './features/data-exchange/export-facility/export-facility.component';

// import { RealTimeDashboardComponent } from './features/data-visualization/real-time-dashboard/real-time-dashboard.component';
// import { DataAnalyticsReportsComponent } from './features/data-visualization/data-analytics-reports/data-analytics-reports.component';

// Guards
// import { AuthGuard } from './core/auth/auth.guard';
// import { AdminGuard } from './core/guards/admin.guard';
// import { HrGuard } from './core/guards/hr.guard';
// import { EmployeeGuard } from './core/guards/employee.guard';
// import { PayrollGuard } from './core/guards/payroll.guard';
// import { TimeAttendanceGuard } from './core/guards/time-attendance.guard';
// import { RecruitmentGuard } from './core/guards/recruitment.guard';
// import { LndGuard } from './core/guards/lnd.guard';
// import { RewardsGuard } from './core/guards/rewards.guard';
// import { PerformanceGuard } from './core/guards/performance.guard';
// import { HealthGuard } from './core/guards/health.guard';
// import { FormsGuard } from './core/guards/forms.guard';
// import { ReportsGuard } from './core/guards/reports.guard';
// import { DataExchangeGuard } from './core/guards/data-exchange.guard';
// import { DataVisualizationGuard } from './core/guards/data-visualization.guard';

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
      { path: 'systems-config', component: SystemsConfigComponent },
      // { path: 'approval-workflow', component: ApprovalWorkflowComponent },
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