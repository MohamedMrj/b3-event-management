import { Component } from '@angular/core';

import { Event, Location } from '../event';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent {
  submitted = false;

  location: Location = {
    street: '',
    city: '',
    country: ''
  };

  event: Event = {
    id: 0,
    title: '',
    shortDescription: '',
    longDescription: '',
    location: this.location,
    startDate: new Date(),
    eventImageUrl: '',
    eventImageAlt: ''
  };

  onSubmit() {
    this.submitted = true;
    console.log("Event: ", this.event);
  }
}
