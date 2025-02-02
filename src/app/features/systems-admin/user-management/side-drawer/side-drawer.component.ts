import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { first } from 'rxjs';

interface User {
  profile: string;
  name: string;
  email: string;
  password: string;
  department: string;
  position: string;
  type: string;
  status: string;
  access: boolean;
  selected?: boolean;
  dateAdded?: Date;
}

interface Employee {
  email: string;
  firstName: string;
  middleName: string;
  surname: string;
  position: string;
  department: string;
  type: string;
  photoUrl?: string; // Add a new property for photo URL
  employee_id?: string; // Add employee ID
}

interface AuditLogEntry {
  user_id: string;
  action: string;
  affected_page: string;
  parameter: string;
  old_parameter: string;
  new_parameter: string;
  ip_address: string;
  date: string;
}

@Component({
  selector: 'app-side-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-drawer.component.html',
  styleUrl: './side-drawer.component.css'
})
export class SideDrawerComponent {
  @Input() isOpen = false; 
  @Input() employeeData: any;
  @Output() close = new EventEmitter<void>();
  isDrawerOpen = false; // Flag to check if the drawer is open

  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  
  // Employee Form Fields
  employee = {
    email: '',
    password: '',
    firstname: '',
    midname: '',
    surname: '',
    position: '',
    department: '',
    type: '',
    employee_id: '',
  };

  isEditing = false; // Flag to check if the form is in edit mode
  showPassword = false; // Flag to show password
  photoPreviewUrl = 'https://via.placeholder.com/200x200'; // Default Preview image URL
  showFileTypeAlert = false; // Flag to show file type alert
  showFileSizeAlert = false; // Flag to show file size alert
  photoFile: File | null = null; // File object for the photo
  showModal = false; // Flag to show the modal
  selectedEmployee: any=null; // Selected employee data
  roles: any[] = []; // List of roles
  showPasswordGeneratedMessage: boolean = false; // Flag to show password generated message
  
  idPreview: string = 'Select Department to Preview ID'; //Defaut Preview Message

  openDrawer() {
    this.isDrawerOpen = true;
    this.showModal = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.showModal = false;
    this.close.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeData'] && this.employeeData) {
      // Populate the form with employee data
      this.employee = { ...this.employeeData };
      this.isEditing = true;
    } else {
      this.resetForm();
    }
  }
  
//Script for Employee ID to automatically generate Sequence number
  async getNextSequenceNumber(department: string): Promise<number> {
    try {
      // Fetch the count of employees in the same department for the current year
      const { data, error } = await this.supabaseService
        .getClient()
        .from('profile')
        .select('*', { count: 'exact', head: true })
        .eq('department', department)
        .gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString()) // Employees created this year
        .lt('created_at', new Date(new Date().getFullYear() + 1, 0, 1).toISOString());
  
      if (error) {
        console.error('Error fetching employee count:', error);
        return 1; // Default to 1 if there's an error
      }
  
      // Increment the count by 1 for the next employee
      return (data?.length || 0) + 1;
    } catch (error) {
      console.error('Unexpected error fetching sequence number:', error);
      return 1; // Default to 1 if there's an error
    }
  }
  //Method to update the ID Preview
  async updateIdPreview() {
    if (!this.employee.department) {
      this.idPreview = 'Select Department to Preview ID';
      return;
    }
    const deptCode = this.employee.department.slice(0, 3).toUpperCase();
    const yearPart = new Date().getFullYear().toString().slice(-2);

    //Fetch the next sequence number
    const seqNum = await this.getNextSequenceNumber(this.employee.department);

    //Format: DEP-YY-001
    this.idPreview = `${deptCode}-${yearPart}-${seqNum.toString().padStart(4, '0')}`;
  }

  //Method when the department changes
  onDepartmentChange() {
    this.updateIdPreview();
  }

  constructor(private supabaseService: SupabaseService) {}

  // Add Audit Log Creation Logic
  private async createAuditLogWithRetry(userId: string, data: any, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.supabaseService.createAuditLog({
          user_id: userId,
          affected_page: 'User Management',
          action: 'Create Employee',
          old_parameter: null,
          new_parameter: JSON.stringify(data)
        });
        console.log('Audit log created successfully');
        return;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed to create audit log:`, error);
        if (i === retries - 1) {
          throw error; // Throw the error after all retries have failed
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  }

  // UNUSED FUNCTION, 
  //toggleModal() {
    //this.showModal = !this.showModal;
    //if (this.showModal) {
      //this.generateRandomPassword();
      //this.selectedEmployee = null;
    //} else {
     // this.resetForm();
    //}
 // }

  //Password Generation Logic
  generateRandomPassword(length: number = 8) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = lowercase + uppercase + numbers + symbols;

    let password = '';
    
    // Ensure at least one character from each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    this.employee.password = password;

    console.log('Password Generated:', this.employee.password); // For debugging 
    
    // Provide visual feedback
    this.showPasswordGeneratedMessage = true;
    setTimeout(() => this.showPasswordGeneratedMessage = false, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  //Form Submission Logic, THIS IS WHERE THE CREATE, EDIT, UPDATE FOR EMPLOYEE DATA TAKES PLACE, DOES NOT UPDATE AT THE MOMENT AFTER ADDING EMPLOYEE ID NUMBER GENERATOR FUNCTION
  async onSubmit() {
    console.log('Submitting employee data:', this.employee);
    // Validate email
    if (!this.isValidEmail(this.employee.email)) {
      console.error('Invalid email format');
      alert('Please enter a valid email address.');
      return;
    }
    // Department input is required before generating Employee ID
    if (!this.employee.department){
      alert('Department is required to generate Employee ID');
      return;
    }
    try {
      // Upload photo if a file is selected
      const photoUrl = await this.uploadPhoto();
      // Employee Error Handling
      const { data, error } = await this.supabaseService.createEmployee(this.employee);
      // Prepare employee data
      const employeeData = {
        first_name: this.employee.firstname,
        mid_name: this.employee.midname,
        surname: this.employee.surname,
        email: this.employee.email,
        password: this.employee.password,
        department: this.employee.department,
        position: this.employee.position,
        types: this.employee.type,
        access: true,
        photo_url: photoUrl || this.photoPreviewUrl
      };
      // Create or update employee
      let response;
      if (this.isEditing) {
        console.log('Updating employee:', employeeData);
        response = await this.supabaseService.updateEmployee(employeeData);
      } else {
        console.log('Creating employee:', employeeData);
        response = await this.supabaseService.createEmployee(employeeData);
      }
      if (response.error) {
        console.error('Error:', response.error);
        alert(`Error ${this.isEditing ? 'updating' : 'creating'} employee. Please try again.`);
        return;
      }  
      console.log('Employee saved successfully:', response.data);
      alert(`Employee ${this.isEditing ? 'updated' : 'created'} successfully.`);  
      // Close the drawer and reset the form
      this.closeDrawer();
      this.resetForm();  
    } catch (error) {
      console.error('Error in onSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  //Employee Creation Logic
  async createEmployee(employee: any) {
    console.log('Received employee data:', employee);
  
    if (!this.isValidEmail(employee.email)) {
      console.error('Invalid email format');
      alert('Please enter a valid email address.');
      return;
    }
  
    // Check for required fields
    const requiredFields = ['firstname', 'surname', 'department', 'position', 'type'];
    for (const field of requiredFields) {
      if (!employee[field]) {
        console.error(`Missing required field: ${field}`);
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }
  
    //Logic for new employee creation
    //
    try {
      const photoUrl = await this.uploadPhoto();
  
      const newEmployee = {
        profile: photoUrl || this.photoPreviewUrl,
        email: employee.email,
        first_name: employee.firstname.trim(),
        mid_name: employee.midname ? employee.midname.trim() : null,
        surname: employee.surname.trim(),
        password: this.generateRandomPassword(12),
        department: employee.department,
        position: employee.position,
        types: employee.type,
        status: 'Active',
        access: true
      };
  
      console.log('Sending employee data to Supabase:', newEmployee);
  
      const { data, error } = await this.supabaseService.createEmployee(newEmployee);
  
      if (error) {
        console.error('Error from Supabase:', error);
        alert(`Error creating employee: ${error.message}`);
        return;
      }
  
      if (!data) {
        console.error('No data returned from Supabase');
        alert('Error creating employee: No data returned');
        return;
      }
  
      console.log('Employee created successfully:', data);
  
      // Create audit log
      try {
        const userId = await this.supabaseService.getCurrentUserId();
        await this.createAuditLogWithRetry(userId, data);
      } catch (auditLogError) {
        console.error('Error creating audit log:', auditLogError);
        // Log the error but continue with the process
      }
  
      const newUser: User = {
        profile: newEmployee.profile,
        name: `${newEmployee.first_name} ${newEmployee.mid_name ? newEmployee.mid_name + ' ' : ''}${newEmployee.surname}`,
        email: newEmployee.email,
        password: '***************',
        department: newEmployee.department,
        position: newEmployee.position,
        type: newEmployee.types,
        status: newEmployee.status,
        access: newEmployee.access
      };
  
      this.users.push(newUser);
      this.filteredUsers = [...this.users];
      this.resetForm();
      alert('Employee created successfully.');
  
    } catch (error) {
      console.error('Unexpected error creating employee:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  //Add Photo Upload Logic, DOES NOT WORK TOO
  async uploadPhoto(): Promise<string | null> {
    if (!this.photoFile) {
      console.log('No photo file selected');
      return null;
    }  
    try {
      console.log('Uploading photo:', this.photoFile.name);
      const fileName = `${Date.now()}_${this.photoFile.name}`;
      const { data, error } = await this.supabaseService.uploadFile('photos', fileName, this.photoFile);  
      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }  
      console.log('Upload response:', data);  
      if (data?.path) {
        const fullUrl = `https://vhmftufkipgbxmcimeuq.supabase.co/storage/v1/object/public/photos/${data.path}`;
        console.log('Full photo URL:', fullUrl);
        return fullUrl;
      } else {
        console.warn('Upload successful, but no path returned');
        return null;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
      return null;
    }
  }

  //Reset Form Logic
  resetForm() {
    const currentPassword = this.employee.password; //Store the currently generated password
    this.employee = {
      email: '',
      password: '',
      firstname: '',
      midname: '',
      surname: '',
      position: '',
      department: '',
      type: '',
      employee_id: ''
    };
    this.photoPreviewUrl = 'https://via.placeholder.com/200x200';
    this.photoFile = null;
    this.showFileTypeAlert = false;
    this.showFileSizeAlert = false;
  }

  //Photo Change Handler
  onPhotoChange(event: any) {
    const file = event.target.files[0];
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
  
    // Reset alerts
    this.showFileTypeAlert = false;
    this.showFileSizeAlert = false;
  
    if (file) {
      if (file.size > maxSizeInBytes) {
        this.showFileSizeAlert = true;
        event.target.value = '';
        return;
      }
  
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.showFileTypeAlert = true;
        event.target.value = '';
        return;
      }
  
      this.photoFile = file;
  
      // Read and display the selected image file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  //Email Validation Logic
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  

}
