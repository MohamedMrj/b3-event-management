import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | undefined;
  eventNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private titleService: Title,
    private pageLocation: Location,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
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
      }
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
        next: (response) => {
          console.log(`Event: ${this.event.id} deleted successfully.`);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          // Add more error handling such as showing an error message to the user
        }
      });
    }
  }

  goBack() {
    this.pageLocation.back();
  }
}
