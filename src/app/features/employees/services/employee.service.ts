import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private api = 'http://localhost:5093/api/employees';

  constructor(private http: HttpClient) {}

  // ---------------------- CREATE ----------------------
  createEmployee(data: any) {
    return this.http.post(this.api, data);
  }

  // ---------------------- PAGINATION + SEARCH ----------------------
  getPaged(page: number, pageSize: number, search: string = "") {
    return this.http.get(
      `${this.api}?page=${page}&pageSize=${pageSize}&search=${search}`
    );
  }

  // ---------------------- GET BY ID ----------------------
  getById(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }

  // ---------------------- UPDATE ----------------------
  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  // ---------------------- DELETE ----------------------
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
