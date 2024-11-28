import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarNavigationModule } from '../sidebar-navigation/sidebar-navigation.module';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../Supabase/supabase.service';
import { FormsModule } from '@angular/forms';



interface Loan {
  loan_id: number,
  name: string;
  type: string;
  outstandingBalance: number;
  totalPaid: number;
  lastPayment: Date;
  status: string;
  selected?: boolean;
}

@Component({
  selector: 'app-loan-information',
  standalone: true,
  imports: [RouterModule, SidebarNavigationModule, CommonModule, FormsModule],
  templateUrl: './loan-information.component.html',
  styleUrls: ['./loan-information.component.css']
})
export class LoanInformationComponent implements OnInit {
  loanRecords: Loan[] = [];
  searchTerm: string = '';
  filteredLoanRecords: Loan[] = [];
  showManageColumn: boolean = false;
  manageButtonText: string = 'Manage Loan Records';
  manageButtonIcon: string = 'edit_note';
  sortColumn: string = '';
  isAscending: boolean = true;
  selectedLoan: Loan | null = null;
  selectedCount: number = 0;

  @ViewChild('loanNameInput') loanNameInput!: ElementRef;
  @ViewChild('loanTypeInput') loanTypeInput!: ElementRef;
  @ViewChild('loanOutstandingBalanceInput') loanOutstandingBalanceInput!: ElementRef;
  @ViewChild('loanTotalPaidInput') loanTotalPaidInput!: ElementRef;
  @ViewChild('loanLastPaymentInput') loanLastPaymentInput!: ElementRef;
  @ViewChild('loanStatusInput') loanStatusInput!: ElementRef;

  constructor(private supabaseService: SupabaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchLoans(); // Fetch data from Supabase
  }

  async fetchLoans() {
    try {
      const { data, error } = await this.supabaseService.getLoanInfo();
      if (error) {
        console.error('Error fetching loan records:', error);
      } else {
        console.log('Raw data from Supabase:', data);
        if (data) {
          this.loanRecords = data.map((loan: any) => ({
            loan_id: loan.loan_id,
            name: loan.loan_name,
            type: loan.loan_type,
            outstandingBalance: loan.outstandingBalance,
            totalPaid: loan.totalPaid,
            lastPayment: loan.lastPayment,
            status: loan.status
          }));
          this.filteredLoanRecords = [...this.loanRecords];
          console.log('Mapped loan records:', this.loanRecords);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  // SEARCH BY FILTERING TABLE
  searchTable() {
    this.filteredLoanRecords = this.loanRecords.filter(loan => {
      return loan.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             loan.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             loan.outstandingBalance.toString().includes(this.searchTerm) ||
             loan.totalPaid.toString().includes(this.searchTerm) ||
             (loan.lastPayment ? loan.lastPayment.toLocaleDateString().includes(this.searchTerm) : false) ||
             loan.status.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  trackByFn: (index: number, loan: Loan) => any = (index, loan) => loan.name;
  // SORTING TABLE BY COLUMN HEADER
  sortTable(column: keyof Loan): void {
    if(column === 'selected') return;
    if (this.sortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortColumn = column;
      this.isAscending = true;
    }

    this.filteredLoanRecords.sort((a, b) => {
      if (column === 'outstandingBalance' || column === 'totalPaid') {
        const valueA = a[column] as number;
        const valueB = b[column] as number;
        return this.isAscending ? valueA - valueB : valueB - valueA;
      } else {
        const valueA = column === 'lastPayment' ? a[column].getTime() : a[column]?.toString().toLowerCase();
        const valueB = column === 'lastPayment' ? b[column].getTime() : b[column]?.toString().toLowerCase();
        return this.isAscending ? (valueA < valueB ? -1 : 1) : (valueA > valueB ? -1 : 1);
      }
    });
  }

  toggleManageColumn() {
    this.showManageColumn = !this.showManageColumn;
    this.manageButtonText = this.showManageColumn ? 'Return to View Mode' : 'Manage Loan Records';
    this.manageButtonIcon = this.showManageColumn ? 'visibility' : 'edit_note';
  }

  toggleModal(modalId: string, loan?: Loan) {
    const modal = document.getElementById(modalId) as HTMLElement;
    if(modal) modal.classList.toggle('hidden');
    if (loan) this.selectedLoan = { ...loan };
  }
  

  async addLoan() {
    const newLoan = {
      loan_name: this.loanNameInput.nativeElement.value,
      loan_type: this.loanTypeInput.nativeElement.value,
      outstandingBalance: +this.loanOutstandingBalanceInput.nativeElement.value,
      totalPaid: +this.loanTotalPaidInput.nativeElement.value,
      lastPayment: this.loanLastPaymentInput.nativeElement.value,
      status: this.loanStatusInput.nativeElement.value,
    };
  
    try {
      // Attempt to add the loan to Supabase
      const { data, error } = await this.supabaseService.addLoan(newLoan);
  
      if (error) {
        console.error('Error adding loan to Supabase:', error.message || error);
        return; // Exit if there is an error
      }
  
      if (data && data.length > 0) {
        // If successful, update local loan records
        const newLoanRecord = {
          loan_id: data[0].loan_id,
          name: newLoan.loan_name,
          type: newLoan.loan_type,
          outstandingBalance: newLoan.outstandingBalance,
          totalPaid: newLoan.totalPaid,
          lastPayment: newLoan.lastPayment,
          status: newLoan.status,
        };
  
        this.loanRecords.push(newLoanRecord);
  
        // Reassign to trigger change detection
        this.filteredLoanRecords = [...this.loanRecords];
  
        // Close the modal and reset the input fields
        this.toggleModal('add-loan-modal');
        this.clearInputs();
  
        // Force Angular to detect changes
        this.cdr.detectChanges();
  
        console.log('Loan added successfully:', newLoanRecord);
      } else {
        console.warn('No data returned from Supabase after adding the loan.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }
  
  // Helper function to clear input fields
  clearInputs() {
    this.loanNameInput.nativeElement.value = '';
    this.loanTypeInput.nativeElement.value = '';
    this.loanOutstandingBalanceInput.nativeElement.value = '';
    this.loanTotalPaidInput.nativeElement.value = '';
    this.loanLastPaymentInput.nativeElement.value = '';
    this.loanStatusInput.nativeElement.value = '';
  }
  



  async editLoan() {
    console.log('Selected Loan:', this.selectedLoan);
  
    if (this.selectedLoan?.loan_id) {  // Check for loan_id
      console.log('Loan ID:', this.selectedLoan.loan_id);
  
      const index = this.loanRecords.findIndex(
        loan => loan.loan_id === this.selectedLoan?.loan_id
      );
  
      if (index > -1) {
        try {
          // Prepare only the necessary fields for update, can be edited if need i-edit yung ibang fields
          const loanData = {
            loan_id: this.selectedLoan.loan_id,
            outstandingBalance: this.selectedLoan.outstandingBalance,
            totalPaid: this.selectedLoan.totalPaid,
            lastPayment: this.selectedLoan.lastPayment,
            status: this.selectedLoan.status,
          };
  
          console.log('Sending to Supabase:', loanData);
          const response = await this.supabaseService.editLoan(loanData);
          const { data, error } = response;
  
          if (error) {
            console.error('Error updating loan in Supabase:', error);
          } else {
            console.log('Successfully updated loan:', data);
            // Update the loan record locally after a successful update
            this.loanRecords[index] = { ...this.selectedLoan };
            this.filteredLoanRecords = [...this.loanRecords];
            this.toggleModal('edit-loan-modal');
          }
        } catch (e) {
          console.error('Unexpected error during loan update:', e);
        }
      } else {
        console.warn('Loan not found in records:', this.selectedLoan?.loan_id);
      }
    } else {
      console.warn('No loan selected for editing.');
    }
  }

  async deleteLoan() {
    if (this.selectedLoan) {
      // Get the id of the selected loan for deletion
      const loanIdToDelete = this.selectedLoan.loan_id;
  
      if (loanIdToDelete) {
        try {
          // Delete the loan by its loan_id
          const { data, error } = await this.supabaseService.deleteLoan(loanIdToDelete);
  
          if (error) {
            console.error("Error deleting loan:", error);
          } else {
            console.log("Successfully deleted loan:", data);
            // Update the filtered loan records to remove the deleted loan
            this.filteredLoanRecords = this.filteredLoanRecords.filter(
              loan => loan.loan_id !== loanIdToDelete
            );
            this.selectedLoan = null;  // Clear selected loan after deletion
            this.selectedCount = 0;
            this.toggleModal('delete-loan-modal'); // Close the modal after deletion
          }
        } catch (e) {
          console.error("Unexpected Error during deletion:", e);
        }
      } else {
        console.warn("No loan selected for deletion.");
      }
    }
  }
  

  toggleSelectAll() {
    const selectAllChecked = this.selectedCount === this.filteredLoanRecords.length;
    this.selectedCount = selectAllChecked ? 0 : this.filteredLoanRecords.length;
    this.filteredLoanRecords.forEach(loan => loan.selected = !selectAllChecked);
  }

  updateSelectedCount() {
    this.selectedCount = this.filteredLoanRecords.filter(loan => loan.selected).length;
  }

  //for batch deletion
  async deleteSelectedLoans(){
    const loanIdsToDelete = this.filteredLoanRecords
    .filter(loan => loan.selected)
    .map(loan => loan.loan_id);

    if (loanIdsToDelete.length > 0){
      try{
        const { data, error } = await this.supabaseService.deleteLoansBatch(loanIdsToDelete);

        if (error){
          console.error("Error deleting loans: ", error);
        }
        else{
          console.log("Successfully deleted loans: ", data)
          this.filteredLoanRecords = this.filteredLoanRecords.filter(
            loan => !loanIdsToDelete.includes(loan.loan_id)
          );
          this.selectedCount = 0;
          this.toggleModal('batch-delete-modal');
        }
      }
      catch (e){
        console.error("Unexpected error during batch deletion: ", e);
      }
      }
    }
}

