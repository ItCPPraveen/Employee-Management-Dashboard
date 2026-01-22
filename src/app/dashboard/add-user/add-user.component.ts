import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from 'src/app/fetch-data.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  employeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private fetchDataService: FetchDataService
  ) { }

  actionType: string = 'Add';
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      if (data['id']) {
        this.actionType = 'Edit';
        this.initForm();
        this.setFormData(data['id']);
      } else {
        this.initForm();
      }
    });
    this.initForm();
  }
  initForm() {
    this.employeeForm = this.fb.group({
      EMPLOYEE_ID: [{ value: '', disabled: true }], // ID shouldn't be editable
      FIRST_NAME: ['', [Validators.required]],
      LAST_NAME: ['', [Validators.required]],
      EMAIL: ['', [Validators.required, Validators.email]],
      PHONE_NUMBER: [''],
      HIRE_DATE: [''],
      JOB_ID: [''],
      SALARY: [0, [Validators.min(0)]],
      COMMISSION_PCT: [null],
      MANAGER_ID: [null],
      DEPARTMENT_ID: [null],
      ROLE: ['employee']
    });
  }

  setFormData(employee: any) {
    this.fetchDataService.getEmployeeById(employee).subscribe({
      next: (data) => {
        console.log('Employee data received:', data);
        this.patchFormData(data);
      },
      error: (err) => {
        console.error('Error fetching employee data:', err);
      }
    });
  }

  patchFormData(employee: any) {
    this.employeeForm.patchValue(employee);
  }

  loader: boolean = false;
  onSubmit() {
    if (this.employeeForm.valid) {
      this.loader = true;
      console.log('Form Data:', this.employeeForm.getRawValue());
      if (this.actionType === 'Add') {
        this.addEmployee();
      } else {
        this.updateEmployee();
      }
    }
  }

  addEmployee() {
    this.fetchDataService.addEmployee(this.employeeForm.getRawValue()).subscribe({
      next: (data) => {
        console.log('Employee added successfully:', data);
        this.loader = false;
        alert('Employee added successfully');
        this.employeeForm.reset();
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        this.loader = false;
      }
    });
  }

  updateEmployee() {
    this.fetchDataService.updateEmployee(this.employeeForm.getRawValue().id, this.employeeForm.getRawValue()).subscribe({
      next: (response) => {
        this.loader = false;
        console.log('Employee updated successfully:', response);
      },
      error: (err) => {
        this.loader = false;
        console.error('Error updating employee:', err);
      }
    });
  }
}
