import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent {
  event: Event | undefined;
  eventNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private eventService: EventService,
    ) {
    this.titleService.setTitle('Edit >>> Event Title <<<');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('eventid');
      this.eventService.events$.subscribe(events => {
        const foundEvent = events.find(e => e.id === eventId);
        if (foundEvent) {
          this.event = foundEvent;
          this.titleService.setTitle(`Editing ${foundEvent.title}`);
          this.eventNotFound = false;
        } else {
          this.eventNotFound = true;
        }
      });
    });
  }

  deleteEvent() {
    console.log('This button will delete events.');
  }
}
