import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.validateToken().pipe(
      map((response) => {
        if (response.valid && this.authService.isUserAdmin()) { // Assuming isUserAdmin() is a method that checks for admin privileges
          return true;
        } else {
          return this.router.createUrlTree(['/unauthorized']); // Redirect to an unauthorized page or similar
        }
      }),
      catchError((err) => {
        console.error('Unexpected error during token validation', err);
        return of(this.router.createUrlTree(['/login']));
      }),
    );
  }
}
