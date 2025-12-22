import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionService } from '../../../core/services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:5093/api/auth';

  constructor(private http: HttpClient, private perms: PermissionService) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: { fullName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');  
    this.perms.clear();
  }

  loadPermissions(done: () => void) {
    this.perms.load().subscribe(() => {
      done();
    });
  }


  saveUserFromToken(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));


    const email =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

    const fullName =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      payload.name;

    const id =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      payload.nameid;

    const roleClaim =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

    const user = {
      email: email,
      fullName: fullName,
      id: id,
      roles: roles
    };

    localStorage.setItem("user", JSON.stringify(user));
  }
}
