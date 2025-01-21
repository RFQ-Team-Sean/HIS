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

    //CRUD Operarion for Timekeeping Tables

    //dtr
  async getAttendances(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('DTR')
        .select('*')
        .order('id', { ascending: true });

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
  async getAttendancesByDate(date: string): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await this.supabase
      .from('DTR')
      .select('*')
      .gte('clock_in', startOfDay.toISOString())
      .lt('clock_in', endOfDay.toISOString());

    if (error) throw error;
    return data || [];
  }

  async insertDTRRecord(status: string, name: string) {
    try {
      const { data, error } = await this.supabase
        .from('DTR')
        .insert([
          {
            status,
            name,
            clock_in: new Date(),
            clock_out: null,  // Explicitly set clock_out to null
            schedule_in: '09:00:00',  // 9:00 AM
            schedule_out: '19:00:00'
          }
        ]);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error inserting DTR record:', error);
      throw error;
    }
  }

  async updateDTRClockOut(name: string) {
    try {
      const { data: existingRecords, error: fetchError } = await this.supabase
        .from('DTR')
        .select('*')
        .eq('name', name)
        .is('clock_out', null);

      if (fetchError) throw fetchError;

      if (existingRecords.length === 0) {
        throw new Error('No matching Time In record found.');
      }

      const { data, error } = await this.supabase
        .from('DTR')
        .update({ clock_out: new Date() })
        .eq('name', name)
        .is('clock_out', null);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating DTR record:', error);
      return { data: null, error };
    }
  }

  async getUser() {
    return await this.supabase.auth.getUser();
  }

  async checkTimeInRecord(name: string) {
    try {
      // Find the most recent clock_in record for the user that does not have a clock_out time
      const { data, error } = await this.supabase
        .from('DTR')
        .select('*')
        .eq('name', name)
        .is('clock_out', null)
        .order('clock_in', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching existing Time In records:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error checking Time In record:', error);
      return { data: null, error };
    }
  }

  async hasTimedInToday(name: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { data, error } = await this.supabase
        .from('DTR')
        .select('*')
        .eq('name', name)
        .gte('clock_in', today.toISOString())
        .limit(1);

      if (error) throw error;

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking if user has timed in today:', error);
      throw error;
    }
  }
  async getTodayAttendances(): Promise<any[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await this.supabase
        .from('DTR')
        .select('*')
        .gte('clock_in', today.toISOString())
        .order('clock_in', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Fetched today\'s data from Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error fetching today\'s attendances from Supabase:', error);
      throw error;
    }
  }

  //reply
  async createReply(reply: any) {
    return await this.supabase
      .from('replies')
      .insert(reply)
      .select();
  }

  async updateTicket(ticket: any) {
    return await this.supabase
      .from('ticket')
      .update({
        reply: ticket.reply,
        status: ticket.status,
        logres: ticket.logres
      })
      .eq('id', ticket.id)
      .select();
  }

  //dashboard
  async getHolidays() {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];

    console.log('Fetching holidays from', firstDayOfYear, 'to', lastDayOfYear);

    const { data, error } = await this.supabase
      .from('parameters')
      .select('*')
      .eq('parameter_type', 'Holiday')  // Ensure correct case
      .gte('parameter_date', firstDayOfYear)
      .lte('parameter_date', lastDayOfYear)
      .order('parameter_date', { ascending: true });

    if (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }

    console.log('Fetched holidays:', data);
    return data;
  }

  async addTestHoliday() {
    const testName = 'Test Holiday';
    const testDate = new Date().toISOString().split('T')[0]; // Today's date
    const { data, error } = await this.supabase
      .from('parameters')
      .insert([
        { parameter_name: testName, parameter_type: 'Holiday', parameter_date: testDate }
      ]);

    if (error) {
      console.error('Error adding test holiday:', error);
      throw error;
    }

    console.log('Test holiday added:', data);
    return data;
  }

}