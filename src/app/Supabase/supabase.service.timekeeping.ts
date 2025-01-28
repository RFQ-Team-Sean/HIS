import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Time } from '@angular/common';
import { createClient, SupabaseClient, User, Session, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, Timestamp, timestamp } from 'rxjs';

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

  //CRUD Operarion for Timekeeping Tables
    //dtr
  async getAttendances(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('dtr')
        .select('*')
        .order('employee_id', { ascending: true });

      if (error) {
        throw error;
      }
      console.log('Fetched data from Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error fetching attendances from Supabase:', error);
      throw error;
    }
  }
    //for clock in
  async insertEmployeeClockIn(employmeeclockIn: {
    date: Date;
    clock_in: Time;
    hours_work: number;
  }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('dtr')
        .insert([employmeeclockIn])
        .select();

      if (error) {
        console.error('Error adding Employmee DTR Clock In to Supabase:', error.message || error);
        throw error; // Re-throw for further handling in the component
      }
      
      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding Employmee DTR Clock In:', error);
      throw error; // Re-throw for further handling in the component
    }
  }
    //for clock out
  async insertEmployeeClockOut(employmeeclockOut: {
    date: Date;
    clock_out: Time;
    hours_work: number;
  }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('dtr')
        .insert([employmeeclockOut])
        .select();

      if (error) {
        console.error('Error adding Employmee DTR Clock Out to Supabase:', error.message || error);
        throw error; // Re-throw for further handling in the component
      }
      
      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding Employmee DTR Clock Out:', error);
      throw error; // Re-throw for further handling in the component
    }
  }

    //overtime
  async getOvertimeRecords(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('Overtime')
        .select('*')
        .order('employee_id', { ascending: true });

      if (error) {
        throw error;
      }
      console.log('Fetched data from Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error fetching overtime records from Supabase:', error);
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