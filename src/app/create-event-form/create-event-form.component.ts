import { Component, OnInit } from '@angular/core';
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
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css'],
  standalone: true,
  imports: [
    NgIf,
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

  timezones: string[] = [
    'Europe/Stockholm',
    'Europe/London',
    'Europe/Paris',
    'America/New_York',
  ];

  event: Event = {
    id: '',
    title: '',
    longDescription: '',
    shortDescription: '',
    locationStreet: '',
    locationCity: '',
    locationCountry: '',
    organizer: '',
    startDateTime: '',
    endDateTime: '',
    timezone: '',
    imageUrl: '',
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
  ) {}

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

    if (this.isEditMode && this.event.id) {
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
    } else {
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
    }
  }
}
