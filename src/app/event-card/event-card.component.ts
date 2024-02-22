import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, OrganizerInfo } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsUrlPipe } from '../google-maps-url.pipe';
import { LocationFormatPipe } from '../location-format.pipe';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { NgIf, DatePipe, AsyncPipe } from '@angular/common';
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
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  standalone: true,
  imports: [
    MatCard,
    AsyncPipe,
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
export class EventCardComponent implements OnInit {
  @Input() event!: Event;
  organizerInfo$!: Observable<OrganizerInfo>;

  constructor(
    private snackBar: MatSnackBar,
    private eventService: EventService,
  ) {}

  ngOnInit() {
    if (this.event && this.event.creatorUserId) {
      this.organizerInfo$ = this.eventService.getOrganizerContactInfo(this.event.creatorUserId);
    }
  }

  copyToClipboard(eventId: string | undefined): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('Event ID saknas.', 'Stäng', { duration: 3000 });
      return;
    }

    const url = window.location.origin + '/event/' + eventId;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        this.snackBar.open('Kopierad till urklipp.', 'Stäng', {
          duration: 3000,
        }),
      )
      .catch((error) => console.error('Failed to copy to clipboard: ', error));
  }

  rsvp(eventId: string | undefined): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('Event kunde inte hittas.', 'Stäng', {
        duration: 3000,
      });
      return;
    }

    this.snackBar.open(`RSVP funktion inte implementerad ännu. Event ID: ${eventId}`, 'Stäng', {});
  }
}
