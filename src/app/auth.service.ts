import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginInfo, LoginResponse } from './login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginInfo: LoginInfo): Observable<boolean> {
    return this.http.post<LoginResponse>('api/login', loginInfo).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          return true;
        }
        return false;
      }),
      catchError(error => {
        // Optionally handle the error, e.g., logging or displaying a message
        console.error('Login error', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
