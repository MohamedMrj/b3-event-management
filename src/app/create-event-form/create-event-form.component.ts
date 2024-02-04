import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent implements OnInit {
  submitted = false;
  isEditMode = false;
  eventId: string = '';

  timezones: string[] = ['Europe/Stockholm', 'Europe/London', 'Europe/Paris', 'America/New_York'];

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
    imageAlt: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
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
      }
    });
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.isEditMode) {
      console.log("Updating Event: ", this.event);
      this.eventService.updateEvent(this.event.id, this.event).subscribe({
        next: (updatedEvent) => {
          console.log("Event updated successfully:", updatedEvent);
          this.router.navigate(['/event', updatedEvent.id]);
        },
        error: (error) => {
          console.error("Error updating event:", error);
          // Add more error handling such as showing an error message to the user
          this.submitted = false; // Reset submitted status to allow retry
        }
      });
    } else {
      console.log("Creating Event: ", this.event);
      this.eventService.createEvent(this.event).subscribe({
        next: (createdEvent) => {
          console.log("Event created successfully:", createdEvent);
          this.router.navigate(['/event', createdEvent.id]);
        },
        error: (error) => {
          console.error("Error creating event:", error);
          // Add more error handling such as showing an error message to the user
          this.submitted = false; // Reset submitted status to allow retry
        }
      });
    }
  }
}
