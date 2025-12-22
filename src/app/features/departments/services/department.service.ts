import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private api = 'http://localhost:5093/api/departments';

  constructor(private http: HttpClient) {}

  getPaged(page: number, pageSize: number, search: string = "") {
    return this.http.get(`${this.api}?page=${page}&pageSize=${pageSize}&search=${search}`);
  }


  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
