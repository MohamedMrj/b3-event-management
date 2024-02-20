import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginInfo, LoginResponse } from './login';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

  decodeToken(): Observable<any> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found in session storage.'));
    }
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token', decoded);
      return of(decoded);
    } catch (error) {
      console.error('Error decoding token', error);
      return throwError(() => new Error('Error decoding token'));
    }
  }

  decodeTokenAndStore(): void {
    this.decodeToken().subscribe({
      next: (decodedToken) => {
        const user = {
          username: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        };
        this.currentUserSubject.next(user);
      },
      error: (err) => {
        console.error('Error decoding token:', err);
        this.currentUserSubject.next(null);
      }
    });
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
