import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private api = 'http://localhost:5093/api/Projects'; // change to your API base URL

  constructor(private http: HttpClient) {}

  // CREATE
  create(model: any): Observable<any> {
    return this.http.post(this.api, model);
  }

  // GET PAGED
  getPaged(page: number, pageSize: number, search: string = ""): Observable<any> {
    let params = new HttpParams()
      .set("page", page)
      .set("pageSize", pageSize)
      .set("search", search);

    return this.http.get(this.api + '/paged', { params });
  }

  // GET BY ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }

  // UPDATE
  update(id: number, model: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, model);
  }

  // DELETE
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
