import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule],
})
export class EventCardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() longText: string;
  @Input() imageUrl: string;
  @Input() imageAlt: string;
}
