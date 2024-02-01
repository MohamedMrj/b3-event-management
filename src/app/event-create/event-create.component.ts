import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  constructor(
    private titleService: Title,
    private pageLocation: Location,
    ) {
    this.titleService.setTitle('Create Event');
  }

  goBack() {
    this.pageLocation.back();
  }
}
