import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event, OrganizerInfo } from './event';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) { }

  // Fetch all events
  fetchAllEvents(): Observable<Event[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Event[]>('/api/getAllEvents', { headers });
  }

  // Fetch a single event by ID
  fetchEventById(eventId: string): Observable<Event> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Event>(`/api/event/${eventId}`, { headers });
  }

  // Fetch events by organizer
  fetchEventsByOrganizer(organizerId: string): Observable<Event[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Event[]>(`/api/events/creator/${organizerId}`, { headers });
  }

  // Fetch user events
  getUserEvents(userId: string): Observable<Event[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Event[]>(`/api/users/${userId}/events`, { headers });
  }

  // Create a new event
  createEvent(event: Event): Observable<Event> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Event>('/api/event', event, { headers });
  }

  // Update an existing event
  updateEvent(eventId: string, event: Event): Observable<Event> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Event>(`/api/event/${eventId}`, event, { headers });
  }

  // Delete an event
  deleteEvent(eventId: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`/api/event/${eventId}`, { headers });
  }

  // Fetch the organizer's contact information
  getOrganizerContactInfo(userId: string): Observable<OrganizerInfo> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer your-auth-token',
    });
    return this.http.get<OrganizerInfo>(`/api/users/${userId}`, { headers });
  }
}
