import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.css'],
  standalone: true,
})
export class ApiTestComponent implements OnInit {
  event: Event;

  message = '';

  constructor(
    private titleService: Title,
    private eventService: EventService,
    private http: HttpClient
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
