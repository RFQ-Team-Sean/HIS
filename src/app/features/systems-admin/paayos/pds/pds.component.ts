import { Component, AfterViewInit, NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SidebarNavigationModule } from './../sidebar-navigation/sidebar-navigation.module';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../Supabase/supabase.service';
import { CompensationRecordsComponent } from '../personal-data-sheet/view/compensation-records/compensation-records.component';
import { LeavesAttendanceRecordsComponent } from '../leaves-attendance-records/leaves-attendance-records.component';
import 'flowbite';
// import { Datepicker } from 'flowbite';                                                                                                                                                                                                                     =======
import { FormsModule } from '@angular/forms';

interface SidebarItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-pds',
  standalone: true,
  imports: [RouterModule, SidebarNavigationModule, CommonModule, CompensationRecordsComponent, LeavesAttendanceRecordsComponent, FormsModule],
  templateUrl: './pds.component.html',
  styleUrls: ['./pds.component.css'] // Fixed typo (styleUrl -> styleUrls)
})
export class PDSComponent implements AfterViewInit {

  public activeView: string = "General Information";
  public viewItems: string[] = ["General Information", "Employment Records", "Compensation Records", "DTR"];

  surname: string = '';
  firstname: string = '';
  middlename: string = '';
  name_extension?: string = '';
  date_of_birth: string = ''; // ISO format (yyyy-mm-dd)
  sex: string = '';
  place_of_birth: string = '';
  civil_status: string = '';
  height: string = '';
  weight: string = '';
  blood_type: string = '';
  gsis_id_no: string = '';
  pagibig_id_no: string = '';
  philhealth_id_no: string = '';
  sss_no: string = '';
  tin_no: string = '';
  agency_employee_no: string = '';
  citizenship = {
    filipino: false,
    dualCitizenship: false,
    byBirth: false,
    byNaturalization: false,
    country: ''
  };

  residential_address_house_block_lot_no: string = '';
  residential_address_street: string = '';
  residential_address_subdivision: string = '';
  residential_address_barangay: string = '';
  residential_address_city_municipality: string = '';
  residential_address_province: string = '';
  residential_address_zip_code: string = '';

  permanent_address_house_block_lot_no: string = '';
  permanent_address_street: string = '';
  permanent_address_subdivision: string = '';
  permanent_address_barangay: string = '';
  permanent_address_city_municipality: string = '';
  permanent_address_province: string = '';
  permanent_address_zip_code: string = '';

  telephone_no: string = '';
  mobile_no: string = '';
  email_address: string = '';

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeDropdown();
  }

  // Dropdown setup
  private initializeDropdown() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdown');

    if (dropdownButton && dropdownMenu) {
      dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('hidden');
      });
    }
  }

  // Navigation bar setup
  navBarItems: SidebarItem[] = [
    { name: 'Family Background', route: '/pds-family-background' }
  ];

  navigateTo = (route: string) => this.router.navigate([route]);

  switchComponent(view: string) {
    this.activeView = view;
  }

  selectStatus(status: string) {
    this.civil_status = status;
    const dropdownMenu = document.getElementById('dropdown');
    if (dropdownMenu) {
      dropdownMenu.classList.add('hidden');
    }
  }

  async submitForm() {
    try {
      // Validate the date_of_birth field
      if (!this.date_of_birth || !this.isValidDate(this.date_of_birth)) {
        alert('Please enter a valid date of birth.');
        return;
      }

      const response = await this.supabaseService.insertPersonalInformation({
        surname: this.surname,
        firstname: this.firstname,
        middlename: this.middlename,
        name_extension: this.name_extension,
        date_of_birth: this.date_of_birth,
        sex: this.sex,
        place_of_birth: this.place_of_birth,
        civil_status: this.civil_status,
        height_m: this.height,
        weight_kg: this.weight,
        blood_type: this.blood_type,
        gsis_id_no: this.gsis_id_no,
        pagibig_id_no: this.pagibig_id_no,
        philhealth_id_no: this.philhealth_id_no,
        sss_no: this.sss_no,
        tin_no: this.tin_no,
        agency_employee_no: this.agency_employee_no,
        filipino: this.citizenship.filipino,
        dual_citizenship: this.citizenship.dualCitizenship,
        by_birth: this.citizenship.byBirth,
        by_naturalization: this.citizenship.byNaturalization,
        citizenship_country: this.citizenship.country,
        residential_address_house_block_lot_no: this.residential_address_house_block_lot_no,
        residential_address_street: this.residential_address_street,
        residential_address_subdivision: this.residential_address_subdivision,
        residential_address_barangay: this.residential_address_barangay,
        residential_address_city_municipality: this.residential_address_city_municipality,
        residential_address_province: this.residential_address_province,
        residential_address_zip_code: this.residential_address_zip_code,
        permanent_address_house_block_lot_no: this.permanent_address_house_block_lot_no,
        permanent_address_street: this.permanent_address_street,
        permanent_address_subdivision: this.permanent_address_subdivision,
        permanent_address_barangay: this.permanent_address_barangay,
        permanent_address_city_municipality: this.permanent_address_city_municipality,
        permanent_address_province: this.permanent_address_province,
        permanent_address_zip_code: this.permanent_address_zip_code,
        telephone_no: this.telephone_no,
        mobile_no: this.mobile_no,
        email_address: this.email_address,
      });
      console.log('Data inserted successfully:', response);
      alert('Personal data submitted successfully!');
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('Failed to submit personal data. Please try again.');
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
