import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.validateToken().pipe(
      map(response => {
        if (response.valid) {
          return true; // Token is valid, proceed with navigation
        } else {
          // Token is invalid or missing, redirect to login without logging an error
          return this.router.createUrlTree(['/login']);
        }
      }),
      catchError((err) => {
        // Handle truly unexpected errors, if any remain
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
