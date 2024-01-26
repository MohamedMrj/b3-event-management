import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('>>>Event Title<<<');
  }
}
