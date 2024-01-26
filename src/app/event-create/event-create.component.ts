import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Create Event');
  }
}
