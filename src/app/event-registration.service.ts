import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event, OrganizerInfo } from './event';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventRegistrationService {
  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) {}

  registerForEvent(eventId: string, userId: string, registrationStatus: string): Observable<Event> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Event>(
      `/api/event/${eventId}/registrations/${userId}`,
      { registrationStatus },
      { headers },
    );
  }
}
