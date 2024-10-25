import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";
import { NgApexchartsModule } from 'ng-apexcharts';
import { RouterModule, Router } from '@angular/router';
import { DecimalPipe, CommonModule, isPlatformBrowser  } from '@angular/common';
import { SupabaseService } from '../../../Supabase/supabase.service';
import { FlowbiteService } from '../../../services/flowbite.service';
import { FormsModule, NgForm  } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexLegend,
  ApexTooltip,
  ApexGrid,
  ApexMarkers
} from "ng-apexcharts";
import { initFlowbite } from 'flowbite';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
};

export type LineChartOptions = {
  series: {
    name: string;
    data: number[];
  }[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  markers: ApexMarkers;
};

interface EmployeeCompensation {
  employee_id: number;
  base_salary: number;
}

interface EmployeeBenefits {
  description: string;
  amount: number;
  effective_date: Date;
  type: string;
}

interface EmployeeDeductions {
  date: Date;
  taxes: number;
  health_insurance: number;
  retirement_contributions: number;
  pension: number;
  others: number;
}

interface EmployeePayslips {
  date: Date;
  gross_pay: number;
  overtime_pay: number;
  status: boolean;
}

@Component({
  selector: 'app-compensation-records',
  standalone: true,
  imports: [NgApexchartsModule, DecimalPipe, CommonModule, FormsModule  ],
  templateUrl: './compensation-records.component.html',
  styleUrl: './compensation-records.component.css'
})
export class CompensationRecordsComponent implements OnInit{
  public chartOptions: ChartOptions = {
    series: [],
    chart: { type: 'pie' },
    labels: [],
    responsive: [],
    plotOptions: {}
  };
  public lineChartOptions: LineChartOptions;
  public compensationTable: EmployeeCompensation[] = [];
  public employeeBenefits: EmployeeBenefits[] = [];
  public employeeDeductions: EmployeeDeductions[] = [];
  public employeePayslips: EmployeePayslips[] = [];
  public showAddRecordModal = false;
  public totalBenefits = 0;
  public totalAllowances = 0;
  public employeeTotalDeductions = 0;
  public employeeNetPay = 0;

  constructor(private router: Router, private supabaseService: SupabaseService, private flowbiteService: FlowbiteService) {
    this.lineChartOptions = {
      series: [
        {
          name: "Salary",
          data: [7500, 7750, 8000, 8200, 8900, 10000]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        categories: ['Jan 2021', 'Oct 2021', 'Mar 2022', 'Dec 2022', 'May 2023', 'Oct 2024'],
        labels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          colors: ['#333']
        },
        formatter: function (value: number) {
          return value; // Customize the data label format if needed
        }
      },
      stroke: {
        curve: 'smooth', // Makes the line smooth
        width: 2
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4
      },
      markers: {
        size: 6,
        colors: ['#fff'],
        strokeColors: '#007bff',
        strokeWidth: 3
      }
    };
  }
  ngOnInit(): void {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      await this.loadCompensationTable();
      this.loadPieChart();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private async loadCompensationTable(): Promise<void> {
    var compensationRecords: any = {
      compensation_benefits: [],
      employee_compensation: [],
      employee_deductions: [],
      employeePayslips: []
    };

    compensationRecords = await this.supabaseService.getEmployeeCompensationRecords();
    this.compensationTable = compensationRecords.employee_compensation;
    this.employeeBenefits = compensationRecords.compensation_benefits;
    this.employeeDeductions = compensationRecords.employee_deductions;
    this.employeePayslips = compensationRecords.employee_payslips;


    this.calculateCompensationValues();
    console.log("==========");
    console.log(this.employeePayslips);
    console.log("==========");

  }

  private calculateCompensationValues(): void {
    //calculates total allowances
    this.employeeBenefits.forEach(record => {
      if(record.type == "allowance"){
        this.totalAllowances += record.amount;
      }else if(record.type == "benefits"){
        this.totalBenefits += record.amount;
      }
    })

    //calculates total deductions
    this.employeeDeductions.forEach(record => {
      var total = record.taxes + record.health_insurance + record.retirement_contributions + record.pension + record.others;
      this.employeeTotalDeductions += total;
    })

    this.employeeNetPay = this.employeePayslips[0].gross_pay - this.employeeTotalDeductions;
  }

  private loadPieChart(): void {
    this.chartOptions = {
      series: [this.compensationTable[0].base_salary, this.totalAllowances, this.totalBenefits],
      chart: {
        height: 150,
        width: 380,
        type: 'pie'
      },
      labels: ['Base Salary', 'Total Allowances', 'Total Benefits'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -10 // Center the data labels in the middle of the pie slices
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
        offset: 0 // Center the data labels
      }
    } as ChartOptions;
  }

  toggleModal() {
    this.showAddRecordModal = !this.showAddRecordModal;
  }

  async addRecordAllowances(form: NgForm) {
    var data = form.value;
    console.log(data);
    const insertData = {
      type: data.type,
      amount: data.amount,
      description: data.description,
      effective_date: data.date,
      employee_id: 1
    }

    try{
      const response = await this.supabaseService.insertEmployeeCompensationRecord(insertData);
      if (response.error) {
        alert("Complete all the input fields");
      } else {
        this.toggleModal();
        this.loadCompensationTable();
        this.loadPieChart();
      }
    }catch (error) {
      console.error('Unexpected error:', error);
    }

  }
}
