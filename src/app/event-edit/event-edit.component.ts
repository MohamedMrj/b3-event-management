import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    private pageLocation: Location,
    private dialog: MatDialog,
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

  goBack() {
    this.pageLocation.back();
  }

  confirmDiscardChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Do you want to discard the changes?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.goBack();
      }
    });
  }
}
