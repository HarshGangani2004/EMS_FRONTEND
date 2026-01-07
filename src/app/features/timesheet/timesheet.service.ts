import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TimesheetService {

  private api = 'http://localhost:5093/api/Timesheet';

  constructor(private http: HttpClient) {}

  // =====================
  // CREATE
  // =====================
  create(data: any) {
    return this.http.post(this.api, data);
  }

  // =====================
  // MY TIMESHEET
  // =====================
getMyTs(page: number, pageSize: number, filter: any) {

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filter.year)
      params = params.set('year', filter.year);

    if (filter.month)
      params = params.set('month', filter.month);

    if (filter.projectId)
      params = params.set('projectId', filter.projectId);

    if (filter.status)
      params = params.set('status', filter.status);

    if (filter.search)
      params = params.set('search', filter.search);

    return this.http.get(`${this.api}/MyTS`, { params });
  }

  // =====================
  // ALL TIMESHEET
  // =====================
  getAllTs(page: number, pageSize: number, filter: any) {

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filter.year)
      params = params.set('year', filter.year);

    if (filter.month)
      params = params.set('month', filter.month);

    if (filter.projectId)
      params = params.set('projectId', filter.projectId);

    if (filter.status)
      params = params.set('status', filter.status);

    if (filter.search)
      params = params.set('search', filter.search);

    return this.http.get(`${this.api}/AllTs`, { params });
  }

  // =====================
  // GET BY ID
  // =====================
  getById(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }

  // =====================
  // UPDATE
  // =====================
  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  // =====================
  // DELETE
  // =====================
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
  myDashboard() {
    return this.http.get(`${this.api}/dashboard/my`);
  }

  allDashboard() {
    return this.http.get(`${this.api}/dashboard/all`);
  }
}
