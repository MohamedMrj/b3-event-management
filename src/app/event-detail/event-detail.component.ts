import { Component, OnInit } from '@angular/core';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of, Observable, catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event, OrganizerInfo } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsEmbedUrlPipe } from '../google-maps-embed-url.pipe';
import { SafePipe } from '../safe.pipe';
import { GoogleMapsUrlPipe } from '../google-maps-url.pipe';
import { LocationFormatPipe } from '../location-format.pipe';
import { MarkdownPipe } from 'ngx-markdown';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressBar,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
    DatePipe,
    MarkdownPipe,
    LocationFormatPipe,
    GoogleMapsUrlPipe,
    SafePipe,
    GoogleMapsEmbedUrlPipe,
  ],
})
export class EventDetailComponent implements OnInit {
  event!: Event;
  isLoading: boolean = true;
  eventNotFound: boolean = false;
  organizerInfo$!: Observable<OrganizerInfo | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private titleService: Title,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Check if user is redirected after creating or updating an event
    this.route.queryParams.subscribe((params) => {
      if (params['eventCreated'] === 'true' || params['eventUpdated'] === 'true') {
        if (params['eventCreated'] === 'true') {
          this.snackBar.open('Event skapat.', 'Stäng', {
            duration: 3000,
          });
        }
        if (params['eventUpdated'] === 'true') {
          this.snackBar.open('Event uppdaterat.', 'Stäng', {
            duration: 3000,
          });
        }

        // Specify the types for queryParams
        const queryParams: Record<string, string | undefined> = { ...params };
        delete queryParams['eventCreated'];
        delete queryParams['eventUpdated'];

        // Navigate without the parameters
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: '',
          replaceUrl: true,
        });
      }
    });

    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.fetchEvent(eventId);
      } else {
        this.eventNotFound = true;
      }
    });
  }

  fetchEvent(eventId: string) {
    this.isLoading = true;
    this.eventService
      .fetchEventById(eventId)
      .pipe(
        switchMap((foundEvent) => {
          this.event = foundEvent;
          this.titleService.setTitle(foundEvent.title);
          this.isLoading = false;
          this.eventNotFound = false;
          return this.eventService.getOrganizerContactInfo(foundEvent.creatorUserId);
        }),
        catchError((error) => {
          console.error('Error fetching event:', error);
          this.snackBar.open('Fel vid hämtning av event', 'Stäng', {
            duration: 3000,
          });
          this.isLoading = false;
          this.eventNotFound = true;
          return of(null);
        }),
      )
      .subscribe((info) => {
        this.organizerInfo$ = of(info);
      });
  }

  navigateToEditEvent() {
    if (this.event?.id) {
      this.router.navigate(['/event/update/', this.event.id]);
    }
  }

  deleteEvent() {
    if (this.event?.id) {
      console.log(`Deleting event: ${this.event.id}`);
      this.eventService.deleteEvent(this.event.id).subscribe({
        next: () => {
          console.log(`Event: ${this.event.id} deleted successfully.`);
          this.router.navigate(['/'], {
            queryParams: { eventDeleted: 'true' },
          });
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.snackBar.open('Fel vid radering av event', 'Stäng', {
            duration: 3000,
          });
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
