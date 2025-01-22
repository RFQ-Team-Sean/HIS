import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, Session, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import nodemailer from 'nodemailer';

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

  private loginAttempts: { [key: string]: number } = {};

  async signInWithLock(email: string, password: string): Promise<boolean> {
    if (this.loginAttempts[email] >= 3) {
      console.error('Account locked due to multiple failed login attempts.');
      return false;
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in error:', error);
      this.loginAttempts[email] = (this.loginAttempts[email] || 0) + 1;
      if (this.loginAttempts[email] >= 3) {
        await this.disableUserAccountByEmail(email);
      }
      return false;
    }

    this.loginAttempts[email] = 0;
    this.currentUser.next(data.user);
    this.currentSession.next(data.session);
    return true;
  }

  private async disableUserAccountByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Error finding user by email:', error);
      return;
    }

    await this.disableUserAccount(data.id);
  }

  async submitTicketForReenable(email: string, message: string) {
    const { data, error } = await this.supabase
      .from('tickets')
      .insert([{ email, message, status: 'Pending' }]);

    if (error) {
      console.error('Error submitting ticket:', error);
      throw error;
    }

    console.log('Ticket submitted:', data);
    return data;
  }



//CRUD Operations for System Admin Management Tables

  //user creation and sending credentials via email to the user
  async createUserAccount(email: string, role: string) {
  const generatedPassword = Math.random().toString(36).slice(-8); // Simple password generation
  const generatedId = `EMP-${Date.now()}`; // Unique ID using timestamp

  // Create user in Supabase
  const { data, error } = await this.supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true, // Send email confirmation link
    user_metadata: { id_number: generatedId, role },
  });

  if (error) throw new Error(`Error creating user: ${error.message}`);

  // Send email with credentials
  await this.sendEmail(
    email,
    'Your Account Credentials',
    `Hello! Here are your account credentials:
    - Email: ${email}
    - Password: ${generatedPassword}
    - ID Number: ${generatedId}
    Please change your password upon login.`
  );

  return { data, generatedId, generatedPassword };
  }
  async sendEmail(to: string, subject: string, body: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Change this based on your email provider
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to,
      subject,
      text: body,
    });
  }

  //password reset
  async resetUserPassword(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(`Error resetting password: ${error.message}`);
    return data;
  }

  //reenabling of user email after ticket approval
  async reenableUserAccount(email: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Error finding user by email:', error);
      throw new Error('User not found');
    }

    const userId = data.id;

    const { error: updateError } = await this.supabase.auth.admin.updateUserById(userId, {
      user_metadata: { is_disabled: false },
    });

    if (updateError) {
      console.error('Error re-enabling user account:', updateError);
      throw new Error('Failed to re-enable user account');
    }

    console.log(`User account with email ${email} has been re-enabled.`);
  }

  //disabling user account for unathorized access
  async disableUserAccount(employee_id: string) {
    const { error: revokeError } = await this.supabase.auth.admin.signOut(employee_id);
  if (revokeError) throw new Error(`Error revoking session: ${revokeError.message}`);
  // update user metadata to disable access
  const { data, error } = await this.supabase.auth.admin.updateUserById(employee_id, {
    user_metadata: { is_disabled: true },
  });
  if (error) throw new Error(`Error disabling user account: ${error.message}`);
  return data;
  }

  //Roles, Permisisons, and Access Rights(not yet in the supabase)
  async getRoles(): Promise<any> {
    const { data, error } = await this.supabase
      .from('roles')
      .select('*');
    if (error) throw error;
    return data;
  }
  //adding new role
  async addRole(role: { role_name: string; description: string }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('roles')
        .insert([role])
        .select();

      if (error) {
        console.error('Error adding role to Supabase:', error.message || error);
        throw error;
      }

      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding role:', error);
      throw error;
    }
  }
  //updating existing role
  async editRole(role: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('roles')
        .update({ role_name: role.role_name, description: role.description })
        .eq('id', role.id);

      if (error) {
        console.error('Error updating role in Supabase:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (e) {
      console.error('Unexpected error during role update:', e);
      return { data: null, error: e };
    }
  }

  async getPermissions(): Promise<any> {
    const { data, error } = await this.supabase
      .from('permissions')
      .select('*');
    if (error) throw error;
    return data;
  }
  //adding a new permission
  async addPermission(permission: { permission_name: string; description: string }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('permissions')
        .insert([permission])
        .select();

      if (error) {
        console.error('Error adding permission to Supabase:', error.message || error);
        throw error;
      }

      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding permission:', error);
      throw error;
    }
  }
  //updating existing permission
  async editPermission(permission: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('permissions')
        .update({ permission_name: permission.permission_name, description: permission.description })
        .eq('id', permission.id);

      if (error) {
        console.error('Error updating permission in Supabase:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (e) {
      console.error('Unexpected error during permission update:', e);
      return { data: null, error: e };
    }
  }

  async getAccessRights(): Promise<any> {
    const { data, error } = await this.supabase
      .from('access_rights')
      .select('*');
    if (error) throw error;
    return data;
  }
  //adding new access right
  async addAccessRight(accessRight: { role_id: number; permission_id: number }): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('access_rights')
        .insert([accessRight])
        .select();

      if (error) {
        console.error('Error adding access right to Supabase:', error.message || error);
        throw error;
      }

      return { data, error };
    } catch (error) {
      console.error('An unexpected error occurred while adding access right:', error);
      throw error;
    }
  }
  //updating existing access right
  async editAccessRight(accessRight: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('access_rights')
        .update({ role_id: accessRight.role_id, permission_id: accessRight.permission_id })
        .eq('id', accessRight.id);

      if (error) {
        console.error('Error updating access right in Supabase:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (e) {
      console.error('Unexpected error during access right update:', e);
      return { data: null, error: e };
    }
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