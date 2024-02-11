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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [MatFabButton, MatIcon, NgFor, EventCardComponent, MatPaginator],
})
export class EventListComponent implements OnInit {
  eventList: Event[] = [];

  // Pagination properties
  totalEvents: number = 0;
  eventsPerPage: number = 6;
  currentPage: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private eventService: EventService,
    private router: Router,
    private titleService: Title,
    private snackBar: MatSnackBar,
  ) {
    this.titleService.setTitle('Events');
  }

  ngOnInit() {
    this.fetchAllEvents();
  }

  fetchAllEvents() {
    this.eventService.fetchAllEvents().subscribe({
      next: (events) => {
        this.totalEvents = events.length; // Set this based on server response if you implement pagination in the backend

        // Sort events by startDateTime in ascending order
        events.sort((a, b) => {
          const dateA = new Date(a.startDateTime);
          const dateB = new Date(b.startDateTime);
          return dateA.getTime() - dateB.getTime();
        });

        this.eventList = events.slice(
          (this.currentPage - 1) * this.eventsPerPage,
          this.currentPage * this.eventsPerPage,
        );
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.snackBar.open('Failed to fetch events.', 'Close', {
          duration: 3000,
        });
      },
    });
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
