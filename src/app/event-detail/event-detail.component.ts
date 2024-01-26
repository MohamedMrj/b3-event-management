import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle('>>>Event Title<<<');
  }

  navigateToEditEvent() {
    this.router.navigate(['/event/update/:eventId']);
  }
}
