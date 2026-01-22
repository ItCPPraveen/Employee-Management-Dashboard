import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { userData } from "./login/interface/login.interface"
import { userSeedData } from './login/seedData/userSeed';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  // employee.service.ts
  userData: userData = userSeedData;
  private employeeSubject = new BehaviorSubject<userData>(this.userData);
  employees = this.employeeSubject.asObservable();

  fetchEmployees() {
    let data = JSON.parse(localStorage.getItem('userData') || '');
    this.employeeSubject.next(data);
  }
}
