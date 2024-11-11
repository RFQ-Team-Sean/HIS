import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarNavigationModule } from '../../sidebar-navigation/sidebar-navigation.module';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../Supabase/supabase.service';
import { FormsModule } from '@angular/forms';

interface Loan {
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
  styleUrl: './loan-information.component.css'
})

export class LoanInformationComponent {
  loanRecords = [
    { name: 'Personal Loan', type: 'School', outstandingBalance: 5000, totalPaid: 2000, lastPayment: new Date('2024-09-15'), status: 'Pending' },
    { name: 'BDO Bank Loan', type: 'Bank', outstandingBalance: 150000, totalPaid: 50000, lastPayment: new Date('2024-09-01'), status: 'Active' },
    { name: 'Utang kay Jaycel', type: 'Calamity', outstandingBalance: 12000, totalPaid: 7000, lastPayment: new Date('2024-08-30'), status: 'Late' },
    { name: 'Car Loan', type: 'Auto', outstandingBalance: 450000, totalPaid: 200000, lastPayment: new Date('2024-07-15'), status: 'Closed' },
    { name: 'Emergency Loan', type: 'Personal', outstandingBalance: 8000, totalPaid: 3000, lastPayment: new Date('2024-10-05'), status: 'Past Due' },
    { name: 'Home Loan', type: 'Mortgage', outstandingBalance: 1200000, totalPaid: 300000, lastPayment: new Date('2024-06-01'), status: 'In Collections' },
    { name: 'Student Loan', type: 'Education', outstandingBalance: 30000, totalPaid: 15000, lastPayment: new Date('2024-07-20'), status: 'Deferred' },
    { name: 'Credit Card', type: 'Revolving Credit', outstandingBalance: 8000, totalPaid: 3000, lastPayment: new Date('2024-08-15'), status: 'Defaulted' },
    { name: 'Small Business Loan', type: 'Commercial', outstandingBalance: 500000, totalPaid: 100000, lastPayment: new Date('2024-09-10'), status: 'Cancelled' },
    { name: 'Motorcycle Loan', type: 'Auto', outstandingBalance: 30000, totalPaid: 12000, lastPayment: new Date('2024-09-22'), status: 'Restructured' },
    { name: 'Medical Bill Loan', type: 'Medical', outstandingBalance: 15000, totalPaid: 5000, lastPayment: new Date('2024-10-02'), status: 'Pending' },
    { name: 'Furniture Loan', type: 'Personal', outstandingBalance: 2000, totalPaid: 1000, lastPayment: new Date('2024-08-20'), status: 'Late' },
    { name: 'Wedding Loan', type: 'Personal', outstandingBalance: 50000, totalPaid: 20000, lastPayment: new Date('2024-09-08'), status: 'Closed' },
    { name: 'Business Expansion Loan', type: 'Commercial', outstandingBalance: 250000, totalPaid: 50000, lastPayment: new Date('2024-07-01'), status: 'In Collections' },
    { name: 'Refinancing Loan', type: 'Mortgage', outstandingBalance: 1000000, totalPaid: 300000, lastPayment: new Date('2024-09-10'), status: 'Restructured' },
    { name: 'Travel Loan', type: 'Personal', outstandingBalance: 8000, totalPaid: 3000, lastPayment: new Date('2024-08-11'), status: 'Defaulted' },
    { name: 'Green Energy Loan', type: 'Commercial', outstandingBalance: 70000, totalPaid: 10000, lastPayment: new Date('2024-10-01'), status: 'Cancelled' },
    { name: 'Holiday Loan', type: 'Personal', outstandingBalance: 20000, totalPaid: 10000, lastPayment: new Date('2024-09-25'), status: 'Deferred' },
    { name: 'Consolidation Loan', type: 'Personal', outstandingBalance: 15000, totalPaid: 5000, lastPayment: new Date('2024-08-28'), status: 'Closed' },
    { name: 'Appliance Loan', type: 'Revolving Credit', outstandingBalance: 2000, totalPaid: 1000, lastPayment: new Date('2024-09-30'), status: 'In Collections' },
  ];

  searchTerm: string = '';
  filteredLoanRecords: Loan[] = []; //[...this.loanRecords]; // Initially all records are shown

  ngOnInit(): void {
    this.filteredLoanRecords = this.loanRecords;// Initially all records are shown
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

  trackByFn(index: number, item: any): any {
    return item.name; // or another unique identifier for each loan
  }

  showManageColumn : boolean = false
  manageButtonText : string = 'Manage Loan Records';
  manageButtonIcon : string = 'edit_note';

  // SORTING TABLE BY COLUMN HEADER
  sortColumn: string = ''; // Stores the current column being sorted
  isAscending: boolean = true; // Tracks sorting direction

  sortTable(column: keyof Loan): void {
    if(column === 'selected') {
      return;
    }
    if (this.sortColumn === column) {
      this.isAscending = !this.isAscending; // Toggle sort direction
    } else {
      this.sortColumn = column;
      this.isAscending = true; // Default to ascending on a new column
    }

    this.filteredLoanRecords.sort((a, b) => {
      if(column === 'outstandingBalance' || column === 'totalPaid') {
        const valueA = a[column] as number;
        const valueB = b[column] as number;
        if (valueA < valueB) return this.isAscending ? -1 : 1;
        if (valueA > valueB) return this.isAscending ? 1 : -1;
        return 0;
      }
      else {
        const valueA = column === 'lastPayment' ? a[column].getTime() : a[column] ? a[column].toString().toLowerCase() : '';
        const valueB = column === 'lastPayment' ? b[column].getTime() : b[column] ? b[column].toString().toLowerCase() : '';
        if (valueA < valueB) return this.isAscending ? -1 : 1;
        if (valueA > valueB) return this.isAscending ? 1 : -1;
        return 0;
      }
    });

    console.log(`Sorted by ${column}:`, this.filteredLoanRecords);
  }

  toggleManageColumn() {
    this.showManageColumn = !this.showManageColumn;

    this.manageButtonText = this.showManageColumn? 'Return to View Mode' : 'Manage Loan Records';
    this.manageButtonIcon = this.showManageColumn? 'visibility' : 'edit_note';
  }

  selectedLoan: Loan | null = null;
  toggleModal(modalId: string, loan? : Loan) {
    const modal = document.getElementById(modalId) as HTMLElement;

    if(modal) {
      modal.classList.toggle('hidden');
    }

    if (loan) {
      // Clone the selected loan to avoid direct mutation
      this.selectedLoan = { ...loan };
    }
    console.log(this.selectedLoan);
  }

  addLoan() {
    const nameInput = document.getElementById('loan-name-input') as HTMLInputElement | null;
    const typeInput = document.getElementById('loan-type-input') as HTMLInputElement | null;
    const outBalanceInput = document.getElementById('loan-outstandingBalance-input') as HTMLInputElement | null;
    const totalPaidInput = document.getElementById('loan-totalPaid-input') as HTMLInputElement | null;
    const lastPayInput = document.getElementById('loan-lastPayment-input') as HTMLInputElement | null;
    const statusInput = document.getElementById('loan-status-input') as HTMLInputElement | null;

    let hasEmptyField : string | boolean = nameInput?.value === '' || typeInput?.value === ''
    || outBalanceInput?.value === '' || totalPaidInput?.value === ''
    || lastPayInput?.value === '' || statusInput?.value === '';

    if(hasEmptyField) {
      return;
    }

    if (nameInput && typeInput && outBalanceInput && totalPaidInput && lastPayInput && statusInput) {
        this.loanRecords.push({
            name: nameInput.value,
            type: typeInput.value,
            outstandingBalance: Number(outBalanceInput.value),
            totalPaid: Number(totalPaidInput.value),
            lastPayment: new Date(lastPayInput.value),
            status: statusInput.value,
        });

        console.log(this.loanRecords);

        nameInput.value = '';
        typeInput.value = '';
        outBalanceInput.value = '';
        totalPaidInput.value = '';
        lastPayInput.value = '';
        statusInput.value = '';

        this.toggleModal('add-loan-modal');
    } else {
        console.error("One or more input elements are missing.");
    }
  }

  editLoan() {
    if (this.selectedLoan) {
      const index = this.loanRecords.findIndex(
        (loan) => loan.name === this.selectedLoan?.name
      );

      if (index > -1) {
        // Update the loan record with edited data
        this.loanRecords[index] = { ...this.selectedLoan };
      }

      console.log(this.loanRecords);
      this.filteredLoanRecords = [...this.loanRecords];
      // console.log(this.filteredLoanRecords);
      // Close the modal
      this.toggleModal('edit-loan-modal');
    }
  }

  deleteLoan() {
    if (this.selectedLoan) {
      this.loanRecords = this.loanRecords.filter(loan => loan.name !== this.selectedLoan?.name);
      this.toggleModal('delete-loan-modal');
    }

    this.filteredLoanRecords = [...this.loanRecords];
    console.log(this.filteredLoanRecords);
  }

  selectedCount : number = 0;
  toggleSelectAll() {
    const selectAllChecked = this.selectedCount === this.filteredLoanRecords.length;
    this.selectedCount = selectAllChecked ? 0 : this.filteredLoanRecords.length;
    this.filteredLoanRecords.forEach(loan => loan.selected = !selectAllChecked);
  }

  updateSelectedCount() {
    this.selectedCount = this.filteredLoanRecords.filter(loan => loan.selected).length;
  }

  deleteSelectedLoans() {
    this.filteredLoanRecords = this.filteredLoanRecords.filter(loan => !loan.selected);
    this.selectedCount = 0; // Reset the count after deletion
    this.toggleModal('batch-delete-modal');
  }
}
