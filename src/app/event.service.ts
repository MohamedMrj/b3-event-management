import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event } from './event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) { }

  // Fetch all events
  fetchAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/getAllEvents');
  }

  // Fetch a single event by ID
  fetchEventById(eventId: string): Observable<Event> {
    return this.http.get<Event>(`/api/event/${eventId}`);
  }

  // Create a new event
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>('/api/event', event);
  }

  // Update an existing event
  updateEvent(eventId: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`/api/event/${eventId}`, event);
  }

  // Delete an event
  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`/api/event/${eventId}`);
  }
}
