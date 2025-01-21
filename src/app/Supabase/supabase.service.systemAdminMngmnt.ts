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

//CRUD Operations for System Admin Management Tables

// parameters
async getParameters() {
  const { data, error } = await this.supabase
    .from('parameters')
    .select('*');
  if (error) throw error;

  // Sort the data by id in descending order (assuming higher id means newer)
  const sortedData = data.sort((a, b) => b.id - a.id);

  console.log('Fetched and sorted data from Supabase:', sortedData);
  return sortedData;
}

  async createParameter(parameter: any) {
    const { data, error } = await this.supabase
      .from('parameters')
      .insert(parameter);
    if (error) throw error;
    return data;
  }

  async deleteParameter(parameterName: string): Promise<void> {
    const { error } = await this.supabase
      .from('parameters')
      .delete()
      .eq('parameter_name', parameterName);

    if (error) {
      throw error;
    }
  }

  async updateParameter(parameter: any) {
    const { data, error } = await this.supabase
      .from('parameters') // Replace 'parameters' with your actual table name
      .update({
        parameter_name: parameter.parameter_name,
        parameter_type: parameter.parameter_type,
        parameter_date: parameter.parameter_date,
        parameter_time: parameter.parameter_time,
        parameter_time2: parameter.parameter_time2
        // Add any other fields that your parameter object has
      })
      .eq('id', parameter.id); // Assuming 'id' is the unique identifier

    if (error) {
      throw error;
    }

    return data;
  }

  //ticket
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

  //holidays
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