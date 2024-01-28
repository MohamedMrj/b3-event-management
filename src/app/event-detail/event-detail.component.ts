import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private titleService: Title
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('eventid');
      this.eventService.events$.subscribe(events => {
        const foundEvent = events.find(e => e.id === eventId);
        if (foundEvent) {
          this.event = foundEvent;
          this.titleService.setTitle(foundEvent.title);
          this.eventNotFound = false;
        } else {
          this.eventNotFound = true;
        }
      });
    });
  }

  navigateToEditEvent() {
    this.router.navigate(['/event/update/', this.event?.id]);
  }

  deleteEvent() {
    console.log('This button will delete events.');
  }
}
