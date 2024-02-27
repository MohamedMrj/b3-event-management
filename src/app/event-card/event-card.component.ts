import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, OrganizerInfo } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsUrlPipe } from '../google-maps-url.pipe';
import { LocationFormatPipe } from '../location-format.pipe';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { CommonModule, NgIf, DatePipe, AsyncPipe, registerLocaleData } from '@angular/common';
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
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { UserDetails } from '../auth.interfaces';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { DateFormatPipe } from '../date-format.pipe';
import localeSv from '@angular/common/locales/sv';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  standalone: true,
  imports: [
    CommonModule,
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
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    DatePipe,
    LocationFormatPipe,
    GoogleMapsUrlPipe,
    MatRadioModule,
    FormsModule,
    DateFormatPipe,
  ],
})
export class EventCardComponent implements OnInit {
  @Input() event!: Event;
  @Input() registrationStatus!: string;
  statusOptions: string[] = ['Kommer', 'Kanske', 'Kommer inte'];
  organizerInfo$!: Observable<OrganizerInfo>;
  currentUser$: Observable<UserDetails | null>;

  constructor(
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private userService: UserService,
    public authService: AuthService,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    registerLocaleData(localeSv);
  }

  ngOnInit() {
    if (this.event && this.event.creatorUserId) {
      this.organizerInfo$ = this.eventService.getOrganizerContactInfo(this.event.creatorUserId);
    }
  }

  isSameDay(event: Event): boolean {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    return start.toDateString() === end.toDateString();
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

  rsvp(eventId: string | undefined, userId: string, registrationStatus: string): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('Event kunde inte hittas.', 'Stäng', {
        duration: 3000,
      });
      return;
    }

    this.userService.registerForEvent(eventId, userId, registrationStatus).subscribe({
      next: () => {
        this.snackBar.open('Din anmälan är sparad.', 'Stäng', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Failed to register for event: ', error);
        this.snackBar.open('Misslyckades att spara din anmälan.', 'Stäng', {
          duration: 3000,
        });
      },
    });
  }
}
