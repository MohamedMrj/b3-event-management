import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.css'],
})
export class ApiTestComponent implements OnInit {
  event: Event | undefined;

  message = '';

  constructor(
    private titleService: Title,
    private eventService: EventService,
  ) {
    this.titleService.setTitle('API Test');
  }

  ngOnInit() {
    const eventId = '3';

    this.message = eventId;

    this.eventService.fetchEventById(eventId).subscribe({
      next: (data) => {
        this.event = data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
