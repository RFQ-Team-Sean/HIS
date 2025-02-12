import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';

// functions called for html

interface AccessRights {
  [key: string]: boolean;
}

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
  selected?: boolean; // Used for ID selection
  idGenerated?: boolean; // Track ID generation status -- unused code
  employee_id: string; // Add employee_id
}

interface Ticket {
  id: number;
  title: string;
  email: string;
  description: string;
  status: string;
  dateTime: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
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
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, SideDrawerComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})

export class UserManagementComponent implements OnInit {
  // Functions for users tab
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;
  activeTab: string = 'users';
  showManagePopup = false;
  showAddPopup = false;
  showEditPopup = false;
  employees: any[] = [];
  roles: any[] = [];
  selectedEmployee: any = null; //Store the selected employee for editing

  showAccessRightsPopup = false;
  showAddDepartmentPopup = false;
  isEditing = false;
  showModal = false;
  photoPreviewUrl: string = 'https://via.placeholder.com/200x200';;
  showPasswordGeneratedMessage: boolean = false;

  newRole = '';
  selectedRole: any = {};
  usersRights: string = 'none';
  rolesRights: string = 'none';
  supportRights: string = 'none';
  parametersRights: string = 'none';
  dailyRights: string = 'none';
  monthlyRights: string = 'none';
  weeklyRights: string = 'none';
  entriesRights: string = 'none';

  popupUsersRights: string = 'none';
  popupRolesRights: string = 'none';
  popupSupportRights: string = 'none';
  popupParametersRights: string = 'none';
  popupDailyRights: string = 'none';
  popupMonthlyRights: string = 'none'; 
  popupWeeklyRights: string = 'none';
  popupEntriesRights: string = 'none';

  newDepartment = '';
  departmentType = 'all';
  selectedDepartments: string[] = [];
  departments = ['HR', 'IT', 'Finance', 'Marketing'];

  showPhotoMessage = true; // Property to control the visibility of the message
  showFileTypeAlert = false;
  showFileSizeAlert = false;
  photoFile: File | null = null;
  
  // Functions for Support tickets tab
  paginatedTickets: Ticket[] = [];
  searchTicketTerm: string = '';
  ticket_currentPage: number = 1;
  ticket_itemsPerPage: number = 10;
  ticket_totalPages: number = 1;  

  filteredTickets: Ticket[] = []; // Array to hold the tickets after applying any filters
  selectedTickets: boolean[] = []; // Array to keep track of selected state for each ticket (true if selected, false otherwise)  
  filterOption: string = 'all'; // Default filter option

  selectedTicket: any;
  isModalVisible = false;
  replyText: string = ''; // Text for the reply
  currentUser: any; // Make sure this is set with the logged-in user's information

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

  assignedEmployees: string[] = ['Kobe Bryant', 'Alice Guo', 'Carlo Sotto', 'Harry Roque'];
  showCheckboxes = false;
  logAction: any;
  
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  isDrawerOpen = false;

  openDrawer(employeeData?: any) {
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
    this.generateRandomPassword(); // Generate a random password here before the side drawer opens
    this.selectedEmployee = { ...this.employee }; //Update the selectedEmployee with the generated password
    this.isDrawerOpen = true; //opens the drawer
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.isEditing = false;
    this.loadEmployees(); //Refreshes the list after closing 
    this.close.emit();
  }

  addNewRole() {
    this.showCheckboxes = !this.showCheckboxes;
  }

  // for limiting number of rows display in a table
  data: User[] = [  ];
  visibleRows = 10;


  showRolePopup: boolean = false;
  newManageRole: string = '';
  showAssignPopup: boolean = false;
  showDeleteAssigneePopup = false
  searchRoleTerm: string = '';
  assignedUsers: any[] = [];
  assignedRole: { role_id: number; role_name: string } = { role_id: 0, role_name: '' };  // Default value
  selectedUserIds: Set<number> = new Set();

  isManageMode = false; // Add this line

  editingRoleId: number | null = null;
  originalRoleName: string | null = null;

  selectedCount: number = 0;

  sortDirection: 'none' | 'asc' | 'desc' = 'none';

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortDirection = selectElement.value as 'none' | 'asc' | 'desc';
    this.sortedRoles();
  }

  sortedRoles() {
    return this.roles.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.role_name.localeCompare(b.role_name);
      } else {
        return b.role_name.localeCompare(a.role_name);
      }
    });
  }

  deselectAllCheckboxes(): void {
    this.selectedUserIds.clear();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });
  }

  startEdit(role: any) {
  this.editingRoleId = role.role_id;
  this.originalRoleName = role.role_name; // Store the original name
  }

  toggleManageMode() { // Add this method
    this.isManageMode = !this.isManageMode;
  }
  
  clickedRoleId: number | null = null;

  showPassword: any;

  constructor(private supabaseService: SupabaseService) {}

  //Function to automatically generate random password when Creating New Employee Account
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

  //Function for changing photos
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

  //Function for Email format validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  //Function to submit New or Edited Employee Account Data
  async onSubmit() {
    console.log('Submitting employee data:', this.employee);
    if (!this.isValidEmail(this.employee.email)) {
      console.error('Invalid email format');
      alert('Please enter a valid email address.');
      return;
    }
  
    try {
      const photoUrl = await this.uploadPhoto();
  
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
  
      console.log('Employee data on submit:', this.employee);
      console.log('Employee data to be sent:', employeeData);
  
      let response;
  
      if (this.isEditing) {
        console.log('Updating employee:', employeeData);
        response = await this.supabaseService.updateEmployee(employeeData);
  
        if (response.error) {
          console.error('Error updating employee:', response.error);
          alert('Error updating employee. Please try again.');
          return;
        } else {
          console.log('Employee updated successfully:', response.data);
        }
      } else {
        const emailExists = await this.supabaseService.checkEmailExists(this.employee.email);
        if (emailExists) {
          console.error('Email already exists. Please use a different email.');
          alert('Email already exists. Please use a different email.');
          return;
        }
  
        console.log('Creating employee:', employeeData);
        response = await this.supabaseService.createEmployee(employeeData);
  
        if (response.error) {
          console.error('Error creating employee:', response.error);
          alert('Error creating employee. Please try again.');
          return;
        } else {
          console.log('Employee created successfully:', response.data);
        }
      }
  
      alert(`Employee ${this.isEditing ? 'updated' : 'created'} successfully.`);
      this.openDrawer();
      this.resetForm();
      this.loadEmployees();
  
    } catch (error) {
      console.error('Error in onSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  showRoleSuccessMessage: boolean = false;
  showRoleErrorMessage: boolean = false;
  showEmpSuccessMessage: boolean = false;
  showEmpErrorMessage: boolean = false;

  //Function for uploading photos
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
  

  currentUserId: number | null = null;
  currentRoleId: number | null = null;


    //for updating access rights
    async fetchAccessRights(roleId: string) {
      try {
        const accessRights = await this.supabaseService.fetchRoleAccessRights(roleId);
        this.selectedRole = { ...this.selectedRole, ...accessRights };
      } catch (error) {
        console.error('Error fetching access rights:', error);
      }
    }
    
    //for access rights update
    async onAccessRightChange(rightType: string, event: any) {
      this.selectedRole[rightType] = event.target.value;
      await this.saveAccessRights(rightType);
    }

    //for updating access rights
    async saveAccessRights(changedRight: string) {
      if (!this.isManageMode) return;
  
      try {
        await this.supabaseService.updateRoleAccessRight(
          this.selectedRole.role_id,
          changedRight,
          this.selectedRole[changedRight]
        );
        console.log(`${changedRight} updated successfully`);
      } catch (error) {
        console.error(`Error updating ${changedRight}:`, error);
      }
    }
  
  toggleUserSelection(user: User) {
    user.selected = !user.selected;
  }

  getSelectedUsers(): User[] {
    return this.users.filter(user => user.selected);
  }

  async updateEmployee(employee: any) {
    try {
      console.log('Updating employee:', employee);
  
      // Get the original employee data for audit logging
      const originalEmployee = this.users.find(user => user.email === employee.email);
      if (!originalEmployee) {
        throw new Error('Employee not found for update');
      }
  
      // Upload the photo and get the URL
      let photoUrl = null;
      if (this.photoFile) {
        photoUrl = await this.uploadPhoto();
        console.log('New photo uploaded, URL:', photoUrl);
      } else {
        console.log('No new photo to upload');
      }
  
      // Determine the profile picture URL
      const profileUrl = photoUrl || this.photoPreviewUrl || employee.photo_url || 'path/to/default/image.png';
      console.log('Profile URL to be used:', profileUrl);
  
      const updatedUser: Partial<User> = {
        profile: profileUrl,
        name: `${employee.firstname.trim()} ${employee.midname ? employee.midname.trim() + ' ' : ''}${employee.surname.trim()}`,
        email: employee.email.trim(),
        password: employee.password,
        department: employee.department.trim(),
        position: employee.position.trim(),
        type: employee.types.trim(),
        status: 'Active',
        access: true
      };
  
      console.log('Updated user object:', updatedUser);
  
      // Update user in the database
      const { data, error } = await this.supabaseService.updateEmployee({
        ...employee,
        photo_url: profileUrl
      });
  
      if (error) {
        console.error('Error updating employee in Supabase:', error);
        throw new Error(`Failed to update employee: ${error.message}`);
      }
  
      console.log('Employee updated successfully in Supabase:', data);
  
      // Update user locally
      const index = this.users.findIndex(user => user.email === employee.email);
      if (index !== -1) {
        this.users[index] = updatedUser as User;
        console.log('Local user array updated');
      } else {
        console.warn('User not found in local array for update');
      }
      this.filteredUsers = this.users;
      this.updatePagination();
  
      // Log the action
      const auditLogEntry: AuditLogEntry = {
        user_id: 'id', // or the ID of the user performing the action
        action: 'UPDATE_EMPLOYEE',
        affected_page: 'User Management',
        parameter: 'Employee Update',
        old_parameter: JSON.stringify(originalEmployee),
        new_parameter: JSON.stringify(updatedUser),
        ip_address: await this.getClientIpAddress(), // Implement this method to get the client's IP
        date: new Date().toISOString()
      };
  
      await this.supabaseService.logAction(auditLogEntry);
  
      // Close modal and reset form
      this.openDrawer();
      this.resetForm();
  
      // Reload employees to ensure consistency
      await this.loadEmployees();
  
      return updatedUser;
    } catch (error) {
      console.error('Error in updateEmployee:', error);
      // Show an error message to the user
      this.showErrorMessage('Failed to update employee. Please try again.');
      throw error; // Re-throw the error so it can be handled by the caller if needed
    }
  }
  
  // Implement these methods:
  
  private async getClientIpAddress(): Promise<string> {
    // Implement a method to get the client's IP address
    // You might need to use a third-party service or ask your backend to provide this information
    return 'client_ip';
  }
  
  private showErrorMessage(message: string): void {
    // Implement a method to show error messages to the user
    // This could be a modal, toast notification, or alert
    alert(message);
  }
  
  
  resetForm() {
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
  }

  isFormValid(): boolean {
    return !!(this.employee.email && this.employee.firstname && this.employee.surname &&
              this.employee.position && this.employee.department && this.employee.type);
  }

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
      this.updatePagination();
      this.openDrawer();
      this.resetForm();
      alert('Employee created successfully.');
  
    } catch (error) {
      console.error('Unexpected error creating employee:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }
  
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
  ngOnInit() {
    this.loadEmployees();
    this.loadEmployeeNames();
    this.updatePagination();
  } 

    // Added method to fetch employee names
    loadEmployeeNames(): void {
      this.supabaseService.getEmployeeNames().then(data => {
        if (data) {
          this.employees = data.map(emp => ({
            user_id: emp.user_id,
            firstname: emp.first_name,
            midname: emp.mid_name,
            surname: emp.surname
          }));
        } else {
          console.error('No employee data found.');
        }
      }).catch(error => {
        console.error('Error fetching employees:', error);
      });
    }

  //edit the photo here
  async loadEmployees() {
    try {
      console.log('Fetching employees...');
      const { data, error } = await this.supabaseService.getEmployees();
  
      if (error) {
        console.error('Error fetching employees:', error.message);
        return;
      }

      this.data = data.map(employee => ({
        profile:employee.photo_url || 'default-photo-url',
        name: `${employee.first_name} ${employee.surname}`,
        email: employee.email,
        password: '', // Sensitive data, usually masked
        department: employee.department,
        position: employee.position,
        type: employee.types,
        status: employee.status || 'Active',
        access: employee.access !== undefined ? employee.access : true,
        selected: false
      }));
  
      if (!data || data.length === 0) {
        console.warn('No employee data received');
        this.users = [];
        this.filteredUsers = [...this.users];
        this.updatePagination();
        return;
      }
  
      console.log(`Raw employee data (${data.length} employees):`, data);
  
      this.users = await Promise.all(data.map(async (employee: any, index: number): Promise<User> => {
        console.log(`Employee ${index} data:`, employee);
  
        let photoUrl: string | null = null;
        let employeeIdentifier: string | null = null;
  
        if (employee.id) {
          employeeIdentifier = employee.id.toString();
        } else if (employee.email) {
          employeeIdentifier = employee.email;
          console.warn(`Employee at index ${index} has no id, using email as identifier`);
        } else {
          console.warn(`Employee at index ${index} has no id or email`);
        }
  
        if (employeeIdentifier) {
          try {
            photoUrl = await this.supabaseService.getPhotoUrl(employeeIdentifier);
            console.log(`Photo URL for employee ${employeeIdentifier}:`, photoUrl);
          } catch (error) {
            console.error(`Error fetching photo URL for employee ${employeeIdentifier}:`, error);
          }
        }
  
        const user: User = {
          profile: photoUrl || 'photo_url',
          name: `${employee.first_name?.trim() || ''} ${employee.mid_name ? employee.mid_name.trim() + ' ' : ''}${employee.surname?.trim() || ''}`.trim(),
          email: employee.email?.trim() || '',
          password: employee.password || '',
          department: employee.department?.trim() || 'Unassigned',
          position: employee.position?.trim() || 'Unassigned',
          type: employee.type?.trim() || 'Unassigned',
          status: 'Active',
          access: true,
        };
  
        console.log(`Mapped user ${index + 1}:`, user);
  
        return user;
      }));
  
      console.log(`Total users mapped: ${this.users.length}`);
  
      this.filteredUsers = this.users;
      this.updatePagination();
  
      console.log('Employee loading complete');
    } catch (error) {
      console.error('Unexpected error while fetching employees:', error);
      // Here you might want to set some error state or show a user-facing error message
    }
  }  

  searchTable() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }

  get searchEmpRole() {
    return this.employees.filter(emp => 
      `${emp.firstname} ${emp.midname} ${emp.surname}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }
  
  getContractType(position: string): string {
    const positionLower = position.toLowerCase();
    switch (positionLower) {
      case 'manager':
      case 'developer':
        return 'Full-time';
      case 'designer':
        return 'Contract';
      case 'analyst':
        return 'Part-time';
      case 'intern':
        return 'Intern';
      default:
        return 'Part-time';
    }
  }


  toggleUserAccess(user: User) {
    user.access = !user.access;
    user.status = user.access ? 'Active' : 'Inactive';
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  // Delete user
  async deleteUsers() {
    const selectedUsers = this.getSelectedUsers();
    if (selectedUsers.length === 0) {
      console.log("No users selected for deletion");
      return;
    }
  
    // Initialize a counter for successful deletions
    let successfulDeletions = 0;
  
    // Select users to delete
    for (const selectedUser of selectedUsers) {
      try {
        // Delete user profile and associated photo
        const response = await this.supabaseService.deleteUser(selectedUser.email);
        
        if (response.error) {
          console.error('Error deleting user:', response.error.message);
        } else {
          console.log(`User ${selectedUser.email} deleted successfully`);
          successfulDeletions++;
          
          // Remove the user locally
          this.users = this.users.filter(user => user.email !== selectedUser.email);
          this.filteredUsers = this.filteredUsers.filter(user => user.email !== selectedUser.email);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  
    console.log(`Deleted ${successfulDeletions} users`);
  
    // Update pagination
    this.updatePagination();
  
    // Optionally refresh the page
    // window.location.reload();
  }
  

  clearSelections() {
    // Clear selection for each user in the array
    this.users.forEach(user => user.selected = false);
  }

  updatePagination() {
    // Update pagination information based on filtered user list
    const totalUsers = this.filteredUsers.length;
    this.totalPages = Math.ceil(totalUsers / this.itemsPerPage); // Calculate total pages
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end); // Paginate to display users on the first page
    console.log('Page:', this.currentPage, 'Start:', start, 'End:', end);
    console.log('Paginated users:', this.paginatedUsers);
  }

  paginate() {
    // Paginate the filtered user list based on current page and items per page
    const start = (this.currentPage - 1) * this.itemsPerPage; // Calculate start index
    const end = start + this.itemsPerPage; // Calculate end index (exclusive)
    this.paginatedUsers = this.filteredUsers.slice(start, end); // Extract users for the current page
  }

  prevPage() {
    // Navigate to the previous page if current page is greater than 1
    if (this.currentPage > 1) {
      this.currentPage--; // Decrease current page number
      this.updatePagination(); // Update paginated users
    }
  }

  nextPage() {
    // Navigate to the next page if current page is less than total pages
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Increase current page number
      this.updatePagination(); // Update paginated users
    }
  }


  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.clearSelections();
    }
  }

  editUser(user: any) {
    this.employee = {
      email: user.email,
      password: user.password, // Change this line to use the user's password
      firstname: user.name.split(' ')[0],
      midname: user.name.split(' ').length > 2 ? user.name.split(' ')[1] : '',
      surname: user.name.split(' ')[user.name.split(' ').length - 1],
      position: user.position,
      department: user.department,
      type: user.type,
      employee_id: user.employee_id
    };
    this.photoPreviewUrl = user.profile;
    this.showModal = true;
    this.isEditing = true;
  }

// Functions for Sorting alphabetically, ascending and descending order

  sortUsers(sortOption: string): void {
    if (sortOption === 'none') {
      // Default sort: most recently added users
      this.filteredUsers = [...this.users].sort((a, b) => (b.dateAdded || new Date()).getTime() - (a.dateAdded || new Date()).getTime());
    } else if (sortOption === 'asc') {
      // Sort alphabetically ascending
      this.filteredUsers = [...this.users].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'desc') {
      // Sort alphabetically descending
      this.filteredUsers = [...this.users].sort((a, b) => b.name.localeCompare(a.name));
    }
    this.updatePagination();
  }

  onSortOptionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.value as 'asc' | 'desc';
    this.sortUsers(selectedOption);
  }


//DO NOT DELETE: These codes below might be useful in the future

  // doneTicket(){
  //   // Mark selectedTicket as done
  //   this.selectedTicket.status = 'Done';
  //   this.updateTicket(this.selectedTicket);
  //   this.closeModal();
  // }

  // Method to prompt user for filter options
//   promptFilterOptions() {
//   const markAsRead = confirm("Mark all tickets as read? Click 'Cancel' to mark all as unread.");
//   if (markAsRead) {
//     this.markAllAsRead();
//     } else {
//     this.markAllAsUnread();
//     }
//   }

//   // Method to mark all tickets as read
//   markAllAsRead() {
//     this.tickets.forEach(ticket => ticket.status = 'Read');
//     this.filteredTickets = [...this.tickets];
//     this.ticketUpdatePagination();
//   }

//   // Method to mark all tickets as unread
//   markAllAsUnread() {
//     this.tickets.forEach(ticket => ticket.status = 'Unread');
//     this.filteredTickets = [...this.tickets];
//     this.ticketUpdatePagination();
//   }
}