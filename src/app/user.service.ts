import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserRegistration } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) { }

  getUser(userId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`/api/users/${userId}`, { headers });
  }

  getAllUsers(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get('/api/users', { headers });
  }

  deleteUser(userId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`/api/users/${userId}`, { headers });
  }

  registerForEvent(
    eventId: string,
    userId: string,
    registrationStatus: string,
  ): Observable<UserRegistration> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<UserRegistration>(
      `/api/event/${eventId}/registrations/${userId}`,
      { registrationStatus },
      { headers },
    );
  }

  getUserRegistrations(userId: string): Observable<UserRegistration[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<UserRegistration[]>(`/api/users/${userId}/registrations`, { headers });
  }

  getUserRegistrationForEvent(eventId: string, userId: string): Observable<UserRegistration> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<UserRegistration>(`/api/users/${userId}/registration/${eventId}`, {
      headers,
    });
  }
}
