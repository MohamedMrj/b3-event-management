import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent {
  submitted = false;
  isEditMode = false;
  eventId: string;

  timezones: string[] = [ 'Europe/Stockholm', 'Europe/London', 'Europe/Paris', 'America/New_York'];

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
    eventImageUrl: '',
    eventImageAlt: ''
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
        this.eventService.events$.subscribe(events => {
          const foundEvent = events.find(e => e.id === eventId);
          if (foundEvent) {
            this.event = foundEvent;
          } else {
            // Handle the case where the event is not found
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
