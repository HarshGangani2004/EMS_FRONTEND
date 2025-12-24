import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private baseUrl = 'http://localhost:5093/api/Leave';

  constructor(private http: HttpClient) {}

  // =========================
  // USER: APPLY LEAVE
  // =========================
  applyLeave(data: {
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply`, data);
  }

  // =========================
  // USER: GET MY LEAVES (FILTERED)
  // =========================
  getMyLeavesPaged(
    page: number,
    pageSize: number,
    filter: {
      year?: number | null;
      month?: number | null;
      status?: string;
      leaveType?: string;
    }
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    // 🔥 ADD FILTERS DYNAMICALLY
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get(`${this.baseUrl}/my`, { params });
  }

  // =========================
  // ADMIN: GET ALL LEAVES (FILTERED)
  // =========================
  getAllLeavesPaged(
    page: number,
    pageSize: number,
    filter: {
      year?: number | null;
      month?: number | null;
      status?: string;
      leaveType?: string;
      userName?: string;
    }
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get(`${this.baseUrl}/all`, { params });
  }

  // =========================
  // ADMIN: GET PENDING LEAVES
  // =========================
  getPendingLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending`);
  }

  // =========================
  // COMMON: GET LEAVE BY ID
  // =========================
  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // =========================
  // USER: UPDATE LEAVE (PENDING ONLY)
  // =========================
  updateLeave(
    id: number,
    data: {
      leaveType: string;
      fromDate: string;
      toDate: string;
      reason: string;
    }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // =========================
  // ADMIN: APPROVE / REJECT
  // =========================
  updateLeaveStatus(
    id: number,
    status: 'Approved' | 'Rejected'
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { status });
  }

  // =========================
  // USER: DELETE LEAVE (PENDING ONLY)
  // =========================
  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
