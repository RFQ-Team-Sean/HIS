import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, Session, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

interface AuditLogEntry {
  user_id: string;
  action: string;
  affected_page: string;
  parameter: string;
  old_parameter: string;
  new_parameter: string;
  ip_address: string;
  date?: string;
  email?: string;
}

//handles the connection to database and handles user session
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

//CRUD Operations for Employee Management Tables

    // employee information 
  async getEmployeeInformation(): Promise<any> {
    const { data, error } = await this.supabase
        .from('employee_information')
        .select('*')
    return data;
  }
  async addEmployee(employeeData: {
    first_name: Text;
    middle_type: Text;
    last_name: Text;
    suffix: Text;
    birth_date: Date;
    age: number;
    gender: Text;
    contact_num:number;
    email: string;
    address: Text;
    updated_at: Date;
  }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('employee_information')
        .insert([employeeData])
        .select();

      if (error) {
        console.error('Error adding Empoyee Information to Supabase:', error.message || error);
        throw error; // Re-throw for further handling in the component
      }
      
      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding Empoyee Information:', error);
      throw error; // Re-throw for further handling in the component
    }
  }
  async editEmployeeInformation(employeeData: any) {
    console.log('Updating Employee Information with data:', employeeData);

    //checking if employee id is correct
    if (employeeData.employee_id === employeeData.employee_id ){
      console.log('ID match')
    }
    else{
      console.log("ID mismatch")
    }

    try {
      const { data, error } = await this.supabase
        .from('employee_information')
        .update({ })
        .eq('employee_id', employeeData.employee_id);
  
        if (error) {
          console.error('Error updating Employee Information in Supabase:', error);
          return { data: null, error }; // Return the error as is
        }
    
        return { data, error: null }; // Return the successful response with data
      } catch (e) {
        console.error('Unexpected error during Employee Information update:', e);
        return { data: null, error: e }; // Return the error object directly
      }
  }

    //employee personal information
  async getPersonalData(): Promise<any>{
    const {data, error} = await this.supabase
      .from('pds')
      .select('*')
    return data;
  }
  async addPersonalData(personalData: {
    gsis_id: number;
    pagibig_id: number;
    philhealth_no: number;
    sss_no: number;
    tin_no: number;
    height: number;
    weight: number;
    blood_type: Text;
    citizenship: Text;
    civil_status: Text;
    residential_add: Text;
    residential_zip: number;
    permanent_add: Text;
    created_at: Date;
  }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('pds')
        .insert([personalData])
        .select();

      if (error) {
        console.error('Error adding Personal Data to Supabase:', error.message || error);
        throw error; // Re-throw for further handling in the component
      }
      
      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding Personal Data:', error);
      throw error; // Re-throw for further handling in the component
    }
  }
  async editPersonalData(personalData: any) {
    console.log('Updating Employee Personal Data with:', personalData);

    //checking if employee id is correct
    if (personalData.employee_id === personalData.employee_id ){
      console.log('ID match')
    }
    else{
      console.log("ID mismatch")
    }

    try {
      const { data, error } = await this.supabase
        .from('pds')
        .update({ })
        .eq('employee_id', personalData.employee_id);
  
        if (error) {
          console.error('Error updating Personal Data in Supabase:', error);
          return { data: null, error }; // Return the error as is
        }
    
        return { data, error: null }; // Return the successful response with data
      } catch (e) {
        console.error('Unexpected error during Personal Data update:', e);
        return { data: null, error: e }; // Return the error object directly
      }
  }

  //employement records
  async getEmployementRecords() {
    const { data, error } = await this.supabase
      .from('employment_records')
      .select('*');

    if (error) {
      throw error;
    }
    return data;
  }
/*   async addEmploymentRecords(employmentRecordData: {
    position: Text;
    department: Text;
    employment_stat: Text;
    date_hired: Date;
  }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('employment_records')
        .insert([employmentRecordData])
        .select();

      if (error) {
        console.error('Error adding Employment Records to Supabase:', error.message || error);
        throw error; // Re-throw for further handling in the component
      }
      
      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding Employment Records:', error);
      throw error; // Re-throw for further handling in the component
    }
  }
  async editEmploymentRecordData(employmentRecordData: any) {
    console.log('Updating Employee Information with data:', employmentRecordData);

    //checking if employee id is correct
    if (employmentRecordData.employee_id === employmentRecordData.employee_id ){
      console.log('ID match')
    }
    else{
      console.log("ID mismatch")
    }

    try {
      const { data, error } = await this.supabase
        .from('employment_records')
        .update({ })
        .eq('employee_id', employmentRecordData.employee_id);

        if (error) {
          console.error('Error updating Employment Records in Supabase:', error);
          return { data: null, error }; // Return the error as is
        }
    
        return { data, error: null }; // Return the successful response with data
      } catch (e) {
        console.error('Unexpected error during Employment Records update:', e);
        return { data: null, error: e }; // Return the error object directly
      }
  } */

  //personnel movement
  async getPersonnelMovement(): Promise<any>{
    const {data, error} = await this.supabase
      .from('personnel_movement')
      .select('*')
    return data;
  }
 
  //employment records
  async getEmploymentRecords(): Promise<any>{
    const {data, error} = await this.supabase
      .from('employment_records')
      .select('*')
    return data;
  }

  //employee related reports
  async getReports(): Promise<any>{
    const {data, error} = await this.supabase
      .from('employee_related_reports')
      .select('*')
    return data;
  }


}
