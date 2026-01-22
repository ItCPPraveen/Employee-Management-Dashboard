import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  private apiUrl = environment.APIUrl;

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateEmployee(id: number, changes: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, changes);
  }

  getEmployeeById(id: string | number): Observable<any> {
    // Returns an Observable of a single object
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteEmployee(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: any) {
    return this.http.post(this.apiUrl, employee);
  }
}
