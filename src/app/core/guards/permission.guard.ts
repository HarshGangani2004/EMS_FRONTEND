// src/app/core/guards/permission.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {

  constructor(private perm: PermissionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {

    const required = route.data['permission'] as string | undefined;

    // If no permission required → allow access
    if (!required) return of(true);

    // If permissions already loaded → check instantly
    if (this.perm.has(required)) return of(true);

    // Otherwise load, then check
    return this.perm.load().pipe(
      map(perms => {
        if (perms.includes(required)) {
          return true;
        }
        return this.router.createUrlTree(['/forbidden']); // <-- UPDATED
      }),
      catchError(() => of(this.router.createUrlTree(['/forbidden'])))
    );
  }
}
