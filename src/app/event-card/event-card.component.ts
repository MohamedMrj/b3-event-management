import { Component, Input } from '@angular/core';
import { Event } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsUrlPipe } from '../google-maps-url.pipe';
import { LocationFormatPipe } from '../location-format.pipe';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { NgIf, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  standalone: true,
  imports: [
    MatCard,
    RouterLink,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIcon,
    NgIf,
    MatDivider,
    MatCardActions,
    MatButton,
    DatePipe,
    LocationFormatPipe,
    GoogleMapsUrlPipe,
  ],
})
export class EventCardComponent {
  @Input() event!: Event;

  constructor(private snackBar: MatSnackBar) {}

  copyToClipboard(eventId: string | undefined): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('Event ID is missing', 'Close', { duration: 3000 });
      return;
    }

    const url = window.location.origin + '/event/' + eventId;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        this.snackBar.open('Copied to clipboard!', 'Close', { duration: 3000 }),
      )
      .catch((error) => console.error('Failed to copy to clipboard: ', error));
  }

  rsvp(eventId: string | undefined): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('RSVP feature unavailable', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.snackBar.open(
      `RSVP not implemented yet! Event id: ${eventId}`,
      'Close',
      {},
    );
  }
}
