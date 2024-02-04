import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    if (this.isEditMode) {
      console.log("Updating Event: ", this.event);
      // Add logic to call the event update service method here
    } else {
      console.log("Creating Event: ", this.event);
      // Add logic to call the event creation service method here
    }
    this.submitted = true;
  }
}
