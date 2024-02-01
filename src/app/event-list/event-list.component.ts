import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})

export class EventListComponent implements OnInit {
  eventList: Event[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Events');
  }

    ngOnInit() {
        this.eventService.events$.subscribe(events => {
            this.eventList = events;
          });
    }

  navigateToCreateEvent() {
    this.router.navigate(['/event/create']);
  }
}
