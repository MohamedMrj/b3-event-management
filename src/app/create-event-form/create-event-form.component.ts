import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event, Location } from '../event';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent {
  submitted = false;
  isEditMode = false;
  eventId: string;

  location: Location = {
    street: '',
    city: '',
    country: ''
  };

  event: Event = {
    id: '0',
    title: '',
    longDescription: '',
    shortDescription: '',
    location: this.location,
    organizer: '',
    startDate: new Date(),
    eventImageUrl: '',
    eventImageAlt: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.isEditMode = true;
        this.eventService.events$.subscribe(events => {
          const foundEvent = events.find(e => e.id === eventId);
          if (foundEvent) {
            this.event = foundEvent;
          } else {
            // Handle the case where the event is not found
            // Maybe navigate back or show a message
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      console.log("Updating Event: ", this.event);
      // Add logic to update the event here
    } else {
      console.log("Creating Event: ", this.event);
      // Add logic to update the event here
    }
    this.submitted = true;
  }
}
