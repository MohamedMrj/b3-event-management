import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event;
  eventNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private titleService: Title,
    private pageLocation: Location,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    // Check if user is redirected after creating or updating an event
    this.route.queryParams.subscribe(params => {
      if (params['eventCreated'] === 'true' || params['eventUpdated'] === 'true') {
        if (params['eventCreated'] === 'true') {
          this.snackBar.open('Event created successfully!', 'Close', { duration: 3000 });
        }
        if (params['eventUpdated'] === 'true') {
          this.snackBar.open('Event updated successfully!', 'Close', { duration: 3000 });
        }

        // Specify the types for queryParams
        const queryParams: Record<string, string | undefined> = { ...params };
        delete queryParams['eventCreated'];
        delete queryParams['eventUpdated'];

        // Navigate without the parameters
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: '', // remove to keep other query params
          replaceUrl: true // does not add this navigation to history
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
    this.eventService.fetchEventById(eventId).subscribe({
      next: (foundEvent) => {
        this.event = foundEvent;
        this.titleService.setTitle(foundEvent.title);
        this.eventNotFound = false;
      },
      error: () => {
        this.eventNotFound = true;
      },
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
          this.router.navigate(['/'], { queryParams: { eventDeleted: 'true' } });
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.snackBar.open('Error deleting event', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  goBack() {
    this.pageLocation.back();
  }
}
