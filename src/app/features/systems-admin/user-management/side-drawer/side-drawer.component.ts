import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { first } from 'rxjs';

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

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.showModal = false;
    this.close.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['EmployeeData'] && this.employeeData) {
      //Populate the form with employee data
      this.employee = {...this.employeeData};
      this.isEditing = true;
    } else {
      this.resetForm();
    }
  }

  constructor(private supabaseService: SupabaseService) {}

  // Add Form Submission Logic

  toggleModal() {
    this.showModal = !this.showModal;
    if (this.showModal) {
      this.generateRandomPassword();
      this.selectedEmployee = null;
    } else {
      this.resetForm();
    }
  }
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
    
    // Provide visual feedback
    this.showPasswordGeneratedMessage = true;
    setTimeout(() => this.showPasswordGeneratedMessage = false, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  //Form Submission Logic
  async onSubmit() {
    console.log('Submitting employee data:', this.employee);
  
    // Validate email
    if (!this.isValidEmail(this.employee.email)) {
      console.error('Invalid email format');
      alert('Please enter a valid email address.');
      return;
    }
  
    try {
      // Upload photo if a file is selected
      const photoUrl = await this.uploadPhoto();
  
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

  //Add Photo Upload Logic
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
    this.employee = {
      email: '',
      password: '',
      firstname: '',
      midname: '',
      surname: '',
      position: '',
      department: '',
      type: ''
    };
    this.photoPreviewUrl = 'https://via.placeholder.com/200x200';
    this.photoFile = null;
    this.showFileTypeAlert = false;
    this.showFileSizeAlert = false;
  }

  //Photo Chanage Handler
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
