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

//for department position
async getRoles() {
  const { data, error } = await this.supabase
    .from('roles')
    .select('role_name, role_id');

  if (error) {
    throw error;
  }

  return data;
}

async createRole(roleData: any): Promise<PostgrestSingleResponse<any>> {
  const response = await this.supabase.from('roles').insert([{
    role_name: roleData.role_name,
    users_rights: roleData.users_rights,
    roles_rights: roleData.roles_rights,
    sup_rights: roleData.sup_rights,
    par_rights: roleData.par_rights,
    daily_rights: roleData.daily_rights,
    monthly_rights: roleData.monthly_rights,
    weekly_rights: roleData.weekly_rights,
    entries: roleData.entries,
  }]);

  if (response.error) {
    console.error('Error creating role:', response.error.message);
  } else {
    console.log('Role created successfully:', response.data);
  }

  return response;
}

async deleteRole(roleName: string): Promise<void> {
  const { error } = await this.supabase
    .from('roles')
    .delete()
    .eq('role_name', roleName);

  if (error) {
    console.error('Error deleting role:', error.message);
  }
  await this.refreshSession();
}

async updateRoleName(role_id: number, role_name: string): Promise<any> {
  const { data, error } = await this.supabase
    .from('roles')
    .update({ role_name })
    .eq('role_id', role_id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async getRoleById(roleId: number): Promise<PostgrestSingleResponse<any>> {
  const response = await this.supabase.from('roles').select('*').eq('role_id', roleId).single();
  if (response.error) {
    console.error('Error fetching role by ID:', response.error.message);
  } else {
    console.log('Role fetched successfully:', response.data);
  }
  return response;
}

async fetchRoleAccessRights(roleId: string) {
  const { data, error } = await this.supabase
    .from('roles')
    .select('users_rights, roles_rights, sup_rights, par_rights, daily_rights, weekly_rights, monthly_rights, entries')
    .eq('role_id', roleId)
    .single();

  if (error) throw error;
  return data;
}

async updateRoleAccessRight(roleId: string, rightType: string, value: string) {
  const { data, error } = await this.supabase
    .from('roles')
    .update({ [rightType]: value })
    .eq('role_id', roleId);

  if (error) throw error;
  return data;
}

  // CRUD operations for user roles
async getUsersAssignedToRole(roleId: number): Promise<any[]> {
  const { data, error } = await this.supabase
    .from('user_roles')
    .select(`
      user_id,
      profile:profile(first_name, mid_name, surname)
    `)
    .eq('role_id', roleId);

  if (error) {
    console.error('Error fetching assigned users:', error.message);
    return [];
  }
  return data.map(user => ({
    user_id: user.user_id,
    ...user.profile
  }));
}

  async getEmployeeNames() {
    let { data, error } = await this.supabase
      .from('profile')
      .select('user_id, first_name, mid_name, surname');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('profile')
      .select('email')
      .eq('email', email);

    if (error) {
      console.error('Error checking email:', error.message);
      return false;
    }

    return data.length > 0;
  }










  
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



  // PIMAM DASHBOARD
  async getEmployeesTable(): Promise<any> {
    const { data, error } = await this.supabase
        .from('profile')
        .select('*')
    return data;
  }

  // PDS READING

  async getPersonalInfo(): Promise<any>{
    const {data, error} = await this.supabase
      .from('personal_information')
      .select('*')
    return data;
  }

  //COMPENSATION RECORDS PAGE QUERIES
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

  // WRITING ACCESS STARTS HERE
  async insertFamilyBackground(data: any) {
    const { data: insertedData, error } = await this.supabase
      .from('family_background')
      .insert(data);

    return { data: insertedData, error };
  }

  async insertEducationalBackground(data: any) {
    const { data: result, error } = await this.supabase
      .from('educational_background')
      .insert([data]);

    return { result, error };
  }

  async insertPersonalInformation(formData: any) {
    const { data, error } = await this.supabase
      .from('personal_information_pds')
      .insert([formData]);

    if (error) {
      throw error;
    }

    return data;
  }

  async insertPersonalInformationTest(formData: any) {
    const { data, error } = await this.supabase
      .from('personal_information')
      .insert([formData]);

    if (error) {
      throw error;
    }

    return data;
  }


  async insertCivilServiceEligibility(tableName: string, formData: any) {

    const { data, error } = await this.supabase
      .from('civil_service_eligibility')
      .insert([formData]);

    if (error) {
      throw error;
    }
    return data;
  }

}
