import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.validateToken().pipe(
      map((response) => {
        if (response.valid) {
          return true;
        } else {
          return this.router.createUrlTree(['/login']);
        }
      }),
      catchError((err) => {
        console.error('Unexpected error during token validation', err);
        return of(this.router.createUrlTree(['/login']));
      }),
    );
  }
}
