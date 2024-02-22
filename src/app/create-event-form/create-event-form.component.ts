import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
  MatHint,
} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatHint,
    MatSelect,
    NgFor,
    MatOption,
    MatButton,
  ],
})
export class CreateEventFormComponent implements OnInit {
  submitted = false;
  isEditMode = false;
  eventId: string = '';
  currentUser$: Observable<any>;

  event: Event = {
    id: '',
    title: '',
    longDescription: '',
    shortDescription: '',
    locationStreet: '',
    locationCity: '',
    locationCountry: '',
    creatorUserId: '',
    startDateTime: '',
    endDateTime: '',
    image: '',
    imageAlt: '',
  };

  // Set maxlength for input fields
  titleMaxLength: number = 30;
  shortDescriptionMaxLength: number = 100;
  locationStreetMaxLength: number = 30;
  locationCityMaxLength: number = 50;
  locationCountryMaxLength: number = 50;
  imageAltMaxLength: number = 100;
  longDescriptionMaxLength: number = 10000;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    public authService: AuthService,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.isEditMode = true;
        this.fetchEvent(eventId);
      }
    });
  }

  fetchEvent(eventId: string) {
    this.eventService.fetchEventById(eventId).subscribe({
      next: (foundEvent) => {
        this.event = foundEvent;
      },
      error: () => {
        console.error('Event not found:', eventId);
        this.snackBar.open('Event not found', 'Close', { duration: 3000 });
      },
    });
  }

  onSubmit() {
    this.submitted = true;

    // Convert startDateTime and endDateTime to ISO format
    if (this.event.startDateTime) {
      this.event.startDateTime = new Date(
        this.event.startDateTime,
      ).toISOString();
    }
    if (this.event.endDateTime) {
      this.event.endDateTime = new Date(this.event.endDateTime).toISOString();
    }

    // Handle event creation
    if (!this.isEditMode) {
      // Since currentUser$ is an Observable, subscribe to it to get the current user
      // Note: Assuming currentUser$ emits an object that includes userId
      this.currentUser$.subscribe((currentUser) => {
        this.event.creatorUserId = currentUser.userId; // Assign userId to creatorUserId

        // Call createEvent with the modified event object
        this.eventService.createEvent(this.event).subscribe({
          next: (createdEvent) => {
            console.log('Event created successfully:', createdEvent);
            this.router.navigate(['/event', createdEvent.id], {
              queryParams: { eventCreated: 'true' },
            });
          },
          error: (error) => {
            console.error('Error creating event:', error);
            this.snackBar.open('Error creating event', 'Close', {
              duration: 3000,
            });
            this.submitted = false;
          },
        });
      });
    }
    // Handle event update
    else if (this.isEditMode && this.event.id) {
      this.eventService.updateEvent(this.event.id, this.event).subscribe({
        next: (updatedEvent) => {
          console.log('Event updated successfully:', updatedEvent);
          this.router.navigate(['/event', updatedEvent.id], {
            queryParams: { eventUpdated: 'true' },
          });
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.snackBar.open('Error updating event', 'Close', {
            duration: 3000,
          });
          this.submitted = false;
        },
      });
    }
  }
}
