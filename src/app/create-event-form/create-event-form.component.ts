import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css'],
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
        // Add more error handling such as showing an error message to the user
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

    if (this.isEditMode) {
      console.log('Updating Event: ', this.event);
      this.eventService.updateEvent(this.event.id, this.event).subscribe({
        next: (updatedEvent) => {
          console.log('Event updated successfully:', updatedEvent);
          this.router.navigate(['/event', updatedEvent.id]);
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.submitted = false; // Reset submitted status to allow retry
        },
      });
    } else {
      console.log('Creating Event: ', this.event);
      this.eventService.createEvent(this.event).subscribe({
        next: (createdEvent) => {
          console.log('Event created successfully:', createdEvent);
          this.router.navigate(['/event', createdEvent.id]);
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.submitted = false; // Reset submitted status to allow retry
        },
      });
    }
  }
}
