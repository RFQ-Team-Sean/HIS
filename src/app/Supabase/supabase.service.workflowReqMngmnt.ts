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
  }