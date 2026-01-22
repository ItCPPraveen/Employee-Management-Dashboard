import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { userData } from "./login/interface/login.interface"

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private employeeSubject = new BehaviorSubject<userData>({} as userData);
  employees = this.employeeSubject.asObservable();

  fetchEmployees() {
    let data = JSON.parse(localStorage.getItem('userData') || '');
    this.employeeSubject.next(data);
  }
}
