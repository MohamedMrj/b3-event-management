import { Component, Input } from '@angular/core';
import { Event, Location } from '../event';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event: Event;

  formatLocation(location: string | Location): string {
    if (typeof location === 'string') {
      return location;
    } else {
      return `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
    }
  }

  getGoogleMapsUrl(location: string | Location): string {
    let address: string;
    if (typeof location === 'string') {
      address = location;
    } else {
      address = `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
    }
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  }
}
