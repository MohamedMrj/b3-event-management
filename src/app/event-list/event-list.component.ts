import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Event, Location } from '../event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})

export class EventListComponent {
  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle('Events');
  }

  navigateToCreateEvent() {
    this.router.navigate(['/event/create']);
  }

  // Example of a list of events to display until we have a backend
  eventList: Event[] = [
    {
        id: 0,
        title: 'Shiba Inu Gathering',
        shortDescription: 'Dog Lovers Meetup',
        longDescription: 'Join us for a fun afternoon with Shiba Inus!',
        location: {
            street: 'Röda vägen 1',
            city: 'Borlänge',
            country: 'Sweden'
        },
        startDate: new Date(),
        eventImageUrl: `https://material.angular.io/assets/img/examples/shiba2.jpg`,
        eventImageAlt: 'Photo of a Shiba Inu',
    },
    {
        id: 1,
        title: 'Tech Conference',
        shortDescription: 'Exploring the Latest Technologies',
        longDescription: 'Join us for a conference to learn about the latest technologies and trends in the industry.',
        location: {
            city: 'Sälen',
            country: 'Sweden'
        },
        startDate: new Date(),
        eventImageUrl: `https://assets-global.website-files.com/6331e19fdfcbe01f4c12b610/640f82ab5d300300a891d92a_viva.jpeg`,
        eventImageAlt: 'Photo of a tech conference',
    },
    {
        id: 2,
        title: 'Art Exhibition',
        shortDescription: 'Celebrating Creativity',
        longDescription: 'Experience the beauty of art at our exhibition showcasing various forms of creativity.',
        location: {
            city: 'Paris',
            country: 'France'
        },
        startDate: new Date(),
        eventImageUrl: `https://www.jacksonsart.com/blog/wp-content/uploads/2020/01/Mall-Gallery-Main-Gallery-Exhibition-Hire.jpg`,
        eventImageAlt: 'Photo of an art exhibition',
    },
    {
        id: 3,
        title: 'Shiba Inu Gathering',
        shortDescription: 'Dog Lovers Meetup',
        longDescription: 'Join us for a fun afternoon with Shiba Inus!',
        location: {
            city: 'Borlänge',
            country: 'Sweden'
        },
        startDate: new Date(),
        eventImageUrl: `https://material.angular.io/assets/img/examples/shiba2.jpg`,
        eventImageAlt: 'Photo of a Shiba Inu',
    },
    {
        id: 4,
        title: 'Tech Conference',
        shortDescription: 'Exploring the Latest Technologies',
        longDescription: 'Join us for a conference to learn about the latest technologies and trends in the industry.',
        location: {
            city: 'San Francisco',
            country: 'USA'
        },
        startDate: new Date(),
        eventImageUrl: `https://assets-global.website-files.com/6331e19fdfcbe01f4c12b610/640f82ab5d300300a891d92a_viva.jpeg`,
        eventImageAlt: 'Photo of a tech conference',
    }
];
}
