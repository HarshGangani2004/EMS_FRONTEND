import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  delete(arg0: string) {
    throw new Error('Method not implemented.');
  }

  private base = 'http://localhost:5093/api';

  constructor(private http: HttpClient) {}

  get(endpoint: string) {
    return this.http.get(`${this.base}/${endpoint}`);
  }

  post(endpoint: string, data: any) {
    return this.http.post(`${this.base}/${endpoint}`, data);
  }
}
