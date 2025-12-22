import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  roleId: number;
  id?: number;
  email: string;
  fullName?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = 'http://localhost:5093/api/admin';

  constructor(private http: HttpClient) {}

  getUsersPaged(page: number, pageSize: number, search: string) {
    return this.http.get(`${this.api}/users?page=${page}&pageSize=${pageSize}&search=${search}`);
  }

  getUserByEmail(email: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.api}/user?email=${encodeURIComponent(email)}`);
  }

  createUser(model: any): Observable<any> {
    return this.http.post(`${this.api}/create-user`, model);
  }

  deleteUser(email: string): Observable<any> {
    return this.http.delete(`${this.api}/delete-user?email=${encodeURIComponent(email)}`);
  }

  changeRole(email: string, role: string): Observable<any> {
    return this.http.post(`${this.api}/change-role`, { email, role });
  }
}
