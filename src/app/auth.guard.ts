import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs'; // Make sure to import `of` here
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.validateToken().pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          // Redirect to login if token is not valid
          return this.router.parseUrl('/login');
        }
      }),
      catchError((err) => {
        console.error(err);
        // Use `of` to wrap the UrlTree in an Observable
        return of(this.router.parseUrl('/login'));
      })
    );
  }
}
