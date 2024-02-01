import { Component, Input } from '@angular/core';
import { Event, EventLocation } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event: Event;

  constructor(private snackBar: MatSnackBar) {}

  copyToClipboard(eventId: string): void {
    const url = window.location.origin + '/event/' + eventId;
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('Copied to clipboard!', 'Close', {
        duration: 3000
      });
    }).catch((error) => {
      console.error('Failed to copy to clipboard: ', error);
    });
  }

  rsvp(eventId: string): void {
    this.snackBar.open(`RSVP not implemented yet! Event id: ${eventId}`, 'Close', {});
  }
}
