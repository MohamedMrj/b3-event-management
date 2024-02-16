import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from './event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) { }

  // Fetch all events
  fetchAllEvents(): Observable<Event[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event[]>('/api/getAllEvents', { headers });
  }

  // Fetch a single event by ID
  fetchEventById(eventId: string): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event>(`/api/event/${eventId}`, { headers });
  }

  // Create a new event
  createEvent(event: Event): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.post<Event>('/api/event', event, { headers });
  }

  // Update an existing event
  updateEvent(eventId: string, event: Event): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.put<Event>(`/api/event/${eventId}`, event, { headers });
  }

  // Delete an event
  deleteEvent(eventId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`/api/event/${eventId}`, { headers });
  }

  // Helper method to generate HttpHeaders with the Authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Helper method to retrieve the token
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
