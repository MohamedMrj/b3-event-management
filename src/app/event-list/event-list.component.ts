import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';
import { MatPaginator } from '@angular/material/paginator';
import { EventCardComponent } from '../event-card/event-card.component';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.css'],
    standalone: true,
    imports: [
        MatFabButton,
        MatIcon,
        NgFor,
        EventCardComponent,
        MatPaginator,
    ],
})
export class EventListComponent implements OnInit {
  eventList: Event[] = [];

  // Pagination properties
  totalEvents: number = 0;
  eventsPerPage: number = 6;
  currentPage: number = 1;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private eventService: EventService,
    private router: Router,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Events');
  }

  ngOnInit() {
    this.fetchAllEvents();
  }

  fetchAllEvents() {
    this.eventService.fetchAllEvents().subscribe(
      (events) => {
        this.totalEvents = events.length; // Set this based on server response if we implement pagination in the backend
        this.eventList = events.slice(
          (this.currentPage - 1) * this.eventsPerPage,
          this.currentPage * this.eventsPerPage,
        );
      },
      (error) => {
        console.error('Error fetching events:', error);
        // Add more error handling such as showing an error message to the user
      },
    );
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.currentPage = event.pageIndex + 1;
    this.eventsPerPage = event.pageSize;
    this.fetchAllEvents();
  }

  navigateToCreateEvent() {
    this.router.navigate(['/event/create']);
  }
}
