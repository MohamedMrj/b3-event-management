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
  }

  validateToken(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    console.log('Sending token validation request', httpOptions)

    return this.http.get<{ valid: boolean }>('api/validateToken', httpOptions).pipe(
      map(response => {
        return response.valid;
      }),
      catchError(error => {
        console.error('Token validation error', error);
        return throwError(() => new Error('Token validation failed'));
      })
    );
  }
}
