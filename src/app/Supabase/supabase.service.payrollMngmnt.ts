import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, Session, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class SupabaseService {
    private databaseChangeSubject = new BehaviorSubject<boolean>(false);
    public databaseChange$ = this.databaseChangeSubject.asObservable();
    private supabase!: SupabaseClient;
    private isLockAcquired = false;
    private currentUser = new BehaviorSubject<User | null>(null);
    private currentSession = new BehaviorSubject<Session | null>(null);
  
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
      const supabaseUrl = environment.supabaseUrl;
      const supabaseKey = environment.supabaseKey;
      this.supabase = createClient(supabaseUrl, supabaseKey);
      console.log('Supabase client initialized with URL:', supabaseUrl);
      if (isPlatformBrowser(this.platformId)) {
        this.setupRealtimeSubscription();
        this.loadUserAndSession();
      }
    }

    private async loadUserAndSession() {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      if (!userError && user) {
        this.currentUser.next(user);
        const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
        if (!sessionError && session) {
          this.currentSession.next(session);
        }
      }
    }
  
    getCurrentUser(): Observable<User | null> {
      return this.currentUser.asObservable();
    }
  
    getCurrentSession(): Observable<Session | null> {
      return this.currentSession.asObservable();
    }
  
    async isAuthenticated(): Promise<boolean> {
      const session = await this.supabase.auth.getSession();
      return !!session.data.session;
    }
  
    async signIn(email: string, password: string): Promise<boolean> {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        return false;
      }
      this.currentUser.next(data.user);
      this.currentSession.next(data.session);
      return true;
    }
  
    async signOut() {
      return await this.supabase.auth.signOut();
    }

    async refreshSession(): Promise<void> {
      const { data, error } = await this.supabase.auth.refreshSession();
      if (error) {
        console.error('Failed to refresh session:', error);
      } else if (data.session) {
        this.currentSession.next(data.session);
        this.currentUser.next(data.session.user);
      }
    }
  
    private setupRealtimeSubscription(): void {
      this.supabase
        .channel('public:profile')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, payload => {
          console.log('Change received!', payload);
          this.handleDatabaseChange();
        })
        .subscribe();
    }
  
    private handleDatabaseChange(): void {
      this.databaseChangeSubject.next(true);
    }


//CRUD Operations for Payroll Management Tables

  //merits and violations
async insertMeritOrViolation(record: {
    violations: string,
    merits: string,
    date_of_record_v: string | null,
    date_of_record_m: string | null,
    user_id: number 
  }) {
    const { data, error } = await this.supabase
      .from('merits_and_violations')
      .insert([{
        violations: record.violations,
        merits: record.merits,
        date_of_record_v: record.date_of_record_v,
        date_of_record_m: record.date_of_record_m,
        user_id: record.user_id 
      }]);

    return { data, error }; 
  }
  async getProfiles() {
    const { data, error } = await this.supabase
      .from('profile')
      .select('*');

    return { data, error }; 
  }
  async getRecords() {
    const { data, error } = await this.supabase
      .from('merits_and_violations')
      .select('*');

    return { data, error };
  }

   //compensation and benefits
   async getEmployeeCompensationRecords(): Promise<any>{
    const {data, error} = await this.supabase
      .from('employee')
      .select('compensation_benefits(*), employee_compensation(*), employee_deductions(*), employee_payslips(*)')
    return {
      compensation_benefits: data?.[0]['compensation_benefits'],
      employee_compensation: data?.[0]['employee_compensation'],
      employee_deductions: data?.[0]['employee_deductions'],
      employee_payslips: data?.[0]['employee_payslips']
    };
  }
  async insertEmployeeCompensationRecord(data: any) {
    const { data: insertedData, error } = await this.supabase
      .from('compensation_benefits')
      .insert(data);
    return { data: insertedData, error };
  }

  //loan informarion
  async getLoanInfo() {
    const { data, error } = await this.supabase
    .from('loan_information')
    .select(`
      employee_id,
      loan_name,
      loan_type,
      created_at,
      outstanding_balance,
      last_payment,
      status
      `);
      
      return { data, error};
  }

  async addLoan(loanData: {
    loan_name: string;
    loan_type: string;
    outstanding_balance: number;
    total_paid: number;
    last_payment: Date;
    created_at: Date;
    status: string;
  }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('loan_information')
        .insert([loanData])
        .select();

      if (error) {
        console.error('Error adding loan to Supabase:', error.message || error);
        throw error; // Re-throw for further handling in the component
      }
      
      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding the loan:', error);
      throw error; // Re-throw for further handling in the component
    }
  }
  async editLoan(loanData: any) {
    console.log('Updating loan with data:', loanData);

    //checking if loan id is correct
    if (loanData.loan_id === loanData.loan_id ){
      console.log('ID match')
    }
    else{
      console.log("ID mismatch")
    }

    try {
      const { data, error } = await this.supabase
        .from('loan_information')
        .update({
          outstanding_balance: loanData.outstanding_balance,
          total_paid: loanData.total_paid,
          last_payment: loanData.last_payment,
          status: loanData.status,
        })
        .eq('loan_id', loanData.loan_id);
  
        if (error) {
          console.error('Error updating loan in Supabase:', error);
          return { data: null, error }; // Return the error as is
        }
    
        return { data, error: null }; // Return the successful response with data
      } catch (e) {
        console.error('Unexpected error during loan update:', e);
        return { data: null, error: e }; // Return the error object directly
      }
  }
  async deleteLoan(loanId: number) {
     const { data, error } = await this.supabase
        .from('loan_information') // Ensure this is your actual table name
        .delete()
        .eq('loan_id', loanId); // Deleting based on loan_id
        
         if (error) {
        // Log the error to the console
          console.error(`Error deleting loan with loan_id ${loanId}:`, error);
          }
           else {
          console.log(`Successfully deleted loan with loan_id ${loanId}:`, data);
          }
        
        return { data, error }; // Return the response data and any potential error
  }
  async deleteLoansBatch(loanIds: number []): Promise<{data: any; error: any}>{
      try{
        const { data, error } = await this.supabase
        .from('loan_information')
        .delete()
        .in('loan_id', loanIds);
      if (error){
        console.error("Error deleting loans in supabase:", error);
        throw error;
      }
      return { data, error };
      }
      catch (error){
        console.error("An unexpected error occured during batch deletion:", error);
        throw error;
      }
  }

  
  //leave requests
  async getLeaveRequests() {
    const { data, error } = await this.supabase.from('leave_requests').select('* , profile(email)');
    if (error) {
      console.error('Error fetching leave requests:', error);
      return [];
    }
    return data;
  }
  async updateLeaveRequestStatus(requestId: number, newStatus: 'Pending' | 'Approved' | 'Rejected') {
    const { data, error } = await this.supabase
         .from('leave_requests')
         .update({ status: newStatus })
         .eq('id', requestId);

      if (error) {
        console.error('Error updating leave request status:', error);
        return null;
      }
    return data;
  }

  async updateLeaveBalance(requestId: number, newBalance: number) {
    const { data, error } = await this.supabase
        .from('leave_requests')
        .update({ leave_balance: newBalance })
        .eq('id', requestId);
    
    if (error) {
        console.error('Error updating leave balance:', error);
        return { error };
    }
    return { data };
  }
  async getScheduleAdjustmentRequests() {
    const { data, error } = await this.supabase.from('schedule_adjustment_requests').select('* , profile(email)');
    if (error) {
      console.error('Error fetching leave requests:', error);
      return [];
    }
    return data;
  }
  async updateScheduleAdjustmentRequestStatus(requestId: number, newStatus: 'Pending' | 'Approved' | 'Rejected') {
    const { data, error } = await this.supabase
         .from('schedule_adjustment_requests')
         .update({ status: newStatus })
         .eq('id', requestId);

      if (error) {
        console.error('Error updating leave request status:', error);
        return null;
      }
    return data;
  }

}