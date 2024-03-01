import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';
import { EventCardComponent } from '../event-card/event-card.component';
import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { UserDetails } from '../auth.interfaces';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { UserRegistration } from '../user';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [MatFabButton, MatIcon, NgFor, NgIf, EventCardComponent, MatTabsModule],
})
export class EventListComponent implements OnInit {
  currentUser$: Observable<UserDetails | null>;
  allEventsList: Event[] = [];
  userEvents: Event[] = [];
  userRegistrations: UserRegistration[] = [];
  eventsByOrganizer: Event[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.fetchAllEvents();
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.fetchEventsByOrganizer(user.userId);
        this.fetchUserEvents(user.userId);
        this.fetchUserRegistrations(user.userId);
      }
    });
  }

  fetchAllEvents() {
    this.eventService.fetchAllEvents().subscribe({
      next: (events) => {
        this.allEventsList = events;

        // Sort events by startDateTime in ascending order
        events.sort((a, b) => {
          const dateA = new Date(a.startDateTime);
          const dateB = new Date(b.startDateTime);
          return dateA.getTime() - dateB.getTime();
        });
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.snackBar.open('Failed to fetch events.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  fetchUserEvents(userId: string) {
    this.eventService.getUserEvents(userId).subscribe({
      next: (events) => {
        this.userEvents = events;
      },
      error: (error) => {
        console.log('No user events found:', error);
      },
    });
  }

  fetchEventsByOrganizer(organizerId: string) {
    this.eventService.fetchEventsByOrganizer(organizerId).subscribe({
      next: (events) => {
        this.eventsByOrganizer = events;
      },
      error: (error) => {
        console.log('No user created events found:', error);
      },
    });
  }

  fetchUserRegistrations(userId: string) {
    this.userService.getUserRegistrations(userId).subscribe({
      next: (apiResponse) => {
        if (apiResponse.success) {
          this.userRegistrations = apiResponse.data; // Assign the data part of the response
        } else {
          // Optionally, handle the case where the API call was not successful
          console.error('Failed to fetch user registrations:', apiResponse.message);
          this.snackBar.open('Failed to fetch user registrations.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Failed to fetch user registrations:', error);
        this.snackBar.open('Failed to fetch user registrations.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  getRegistrationStatusForEvent(eventId: string): string {
    const registration = this.userRegistrations.find((reg) => reg.eventId === eventId);
    return registration ? registration.registrationStatus : 'RSVP';
  }

  navigateToCreateEvent() {
    this.router.navigate(['/event/create']);
  }
}
