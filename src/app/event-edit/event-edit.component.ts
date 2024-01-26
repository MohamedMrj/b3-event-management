import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Edit >>> Event Title <<<');
  }
}
