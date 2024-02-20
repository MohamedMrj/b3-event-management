import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginInfo, LoginResponse } from './login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginInfo: LoginInfo): Observable<boolean> {
    return this.http.post<LoginResponse>('api/SignIn', loginInfo).pipe(
      map(response => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }

  validateToken(): Observable<{ valid: boolean, error?: string, message?: string }> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return throwError(() => ({ valid: false, error: 'Missing token.' }));
    }

    // Adjusting for sending token as JSON in the request body
    return this.http.post<{ valid: boolean, error?: string, message?: string }>('api/validateToken', { token: token }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Token validation error', error);
        return throwError(() => ({ valid: false, error: 'Token validation failed.' }));
      })
    );
  }
}
