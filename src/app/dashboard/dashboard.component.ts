import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../userDatabase/userInterface';
import { FetchDataService } from '../fetch-data.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private fetchDataService: FetchDataService,
    private router: Router
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['FIRST_NAME', 'EMAIL', 'ROLE', 'id'];
  dataSource!: any;

  public barChartType: ChartType = 'bar';

  // 2. Define the Options (Plugins, Scaling, etc.)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  // 3. Define the Data (This is where your JSON data goes)
  public barChartData: ChartData<'bar'> = {
    labels: ['Admin', 'Donald', 'Michael', 'Pat', 'Susan'], // Employee Names
    datasets: [
      {
        data: [100000, 26000, 13000, 6000, 6500],
        label: 'Salary ($)',
        backgroundColor: 'rgba(67, 67, 70, 0.7)',
      }
    ]
  };

  employees: Employee[] = [];
  isAdmin: boolean = localStorage.getItem('role') === 'admin';
  ngOnInit(): void {
    this.isAdmin ? this.displayedColumns.push('Edit', 'delete') : null;
    this.loadEmployees();
  }
  loadEmployees() {

    this.fetchDataService.getEmployees().subscribe({
      next: (data) => {
        this.barChartData = {
          labels: data.map(emp => emp.FIRST_NAME),
          datasets: [
            {
              data: data.map(emp => emp.SALARY),
              label: 'Employee Salaries',
              backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }
          ]
        };
        this.dataSource = new MatTableDataSource<Employee>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.employees = data;
      },
      error: (err) => {
        console.error('HTTP Error occurred:', err);
      },
      complete: () => {
        console.log('HTTP Request completed');
      }
    });
  }

  view(id: string) {
    this.router.navigate(['/dashboard/employee', id]);
  }

  edit(id: string) {
    this.router.navigate(['/dashboard/add-edit-user'], { queryParams: { id: id } });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(empDetails: Employee) {
    if (empDetails.ROLE == 'admin') {
      alert('Admin cannot be deleted');
      return;
    }
    const empId = empDetails.EMPLOYEE_ID;
    if (empId) {
      this.fetchDataService.deleteEmployee(empId).subscribe({
        next: (response) => {
          this.loadEmployees();
          console.log('Employee deleted successfully:', response);
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
        }
      });
    }
  }

}
