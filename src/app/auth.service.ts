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

  validateToken(): Observable<{ valid: boolean, error?: string }> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return of({ valid: false, error: 'Missing token' });
    }

    return this.http.post<{ valid: boolean, error?: string }>('api/validateToken', { token: token }).pipe(
      map(response => response),
      catchError(error => {
        // Instead of throwing an error, return a response indicating the token is invalid
        console.error('Token validation error', error); // Consider removing or adjusting this log based on your decision
        return of({ valid: false, error: 'Token validation failed' });
      })
    );
  }

  decodeToken(): Observable<any> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return of(null);
    }
    try {
      const decoded = jwtDecode(token);
      return of(decoded);
    } catch (error) {
      console.error('Error decoding token', error);
      return throwError(() => new Error('Error decoding token'));
    }
  }

  decodeTokenAndStore(): void {
    this.decodeToken().subscribe({
      next: (decodedToken) => {
        if (decodedToken) { // Check if decodedToken is not null
          const user = {
            username: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            // Include other properties as needed
          };
          this.currentUserSubject.next(user); // Store the mapped user data
        } else {
          // Handle the case when decodedToken is null (e.g., user not logged in)
          this.currentUserSubject.next(null); // You might choose to do nothing or set to null
        }
      },
      error: (err) => {
        console.error('Error decoding token:', err);
        this.currentUserSubject.next(null); // Reset on error
      }
    });
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
