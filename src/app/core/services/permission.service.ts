import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private api = 'http://localhost:5093/api/roles';
  private perms$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {}

  // Load permissions from backend
  load(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/my-permissions`).pipe(
      tap(list => this.perms$.next(list || [])),
      catchError(err => {
        console.error('Permission load failed', err);
        this.perms$.next([]);
        return of([]);
      })
    );
  }

  // For template usage
  has(name: string): boolean {
    return this.perms$.value.includes(name);
  }

  // Expose observable to components
  get permissions$(): Observable<string[]> {
    return this.perms$.asObservable();
  }

  // Clear on logout
  clear() {
    this.perms$.next([]);
  }
}
