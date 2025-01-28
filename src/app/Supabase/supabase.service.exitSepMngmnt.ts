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

//CRUD Operations for Exit Separateion Management Tables
  //exit interview form
  async getExitInterviewForm(): Promise<PostgrestSingleResponse<any>> {
    return await this.supabase
    .from('exit_interview_form')
    .select('*');
  }
  async addExitInterviewForm(ExitInterviewData: {
    resignation_date: string,
    reason_for_leaving: string,
    feedback_workenvi: string,
    feedback_management: string,
    suggestions: string,
    overall_exp_rating: string,
    interviewer_name: string,
    interview_date: Date,
  }): Promise<{ data: any; error: any }> {
    try{
      const { data, error } = await this.supabase
      .from('exit_interview_form')
      .insert([ExitInterviewData]);
    if (error) {
      console.error('Error inserting exit interview data to Supabase:', error.message || error);
      throw error; // Re-throw for further handling in the component
    }
    
    return { data, error };
  } catch (error) {
    console.error('An unexpected error occurred while inserting exit interview data to Supabase:', error);
    throw error; // Re-throw for further handling in the component
  }
  }
  async generateExitInterviewForm(data: any): Promise<PostgrestSingleResponse<any>> {
    return await this.supabase
    .from('exit_interview_form')
    .insert(data);
  }

  //clearance form
  async getClearanceForm(): Promise<{ data: any; error: any }> {
    return await this.supabase
    .from('clearance_form')
    .select('*');
  }
  async addClearanceForm(ClearanceData: {
    clearance_date: Date,
    status: string,
    remarks: string,
  }): Promise<{ data: any; error: any }> {
    try{
      const { data, error } = await this.supabase
      .from('clearance_form')
      .insert([ClearanceData]);
    if (error) {
      console.error('Error inserting clearance data to Supabase:', error.message || error);
      throw error; // Re-throw for further handling in the component
    }
    
    return { data, error };
  } catch (error) {
    console.error('An unexpected error occurred while inserting clearance data to Supabase:', error);
    throw error; // Re-throw for further handling in the component
  }
  }
  async generateClearanceForm(data: any): Promise<PostgrestSingleResponse<any>> {
    return await this.supabase
    .from('clearance_form')
    .insert(data);
  }

  //terminal leave form
  async getTerminalLeaveForm(): Promise<{ data: any; error: any }> {
    return await this.supabase
    .from('terminal_leave_form')
    .select('*');
  }
  async addTerminalLeaveForm(TerminalLeaveData: {
    leave_start_date: Date,
    leave_end: Date,
    total_days: number,
    reason_for_leave: string,
    approval_status: string,
    approved_by: string,
    approval_date: Date,
    status: string,
  }): Promise<{ data: any; error: any }> {
    try{
      const { data, error } = await this.supabase
      .from('terminal_leave_form')
      .insert([TerminalLeaveData]);
    if (error) {
      console.error('Error inserting terminal leave data to Supabase:', error.message || error);
      throw error; // Re-throw for further handling in the component
    }
    
    return { data, error };
  } catch (error) {
    console.error('An unexpected error occurred while inserting terminal leave data to Supabase:', error);
    throw error; // Re-throw for further handling in the component
  }
  }
  async generateTerminalLeaveForm(data: any): Promise<PostgrestSingleResponse<any>> {
    return await this.supabase
    .from('terminal_leave_form')
    .insert(data);
  }

}