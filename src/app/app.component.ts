import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Event } from './event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'B3 Events';
  message = '';

  constructor(private http: HttpClient, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title); //

    this.get().subscribe(response => {
      this.message = response;
    });
  }

  private get(): Observable<any> {
    let params = new HttpParams().set('name', 'B3-eventwebb');

    return this.http.get('/api/message', { responseType: 'text', params: params });
  }

  // Example of a list of events to display until we have a backend
  eventList: Event[] = [
    {
      id: 0,
      title: 'Shiba Inu Gathering',
      subtitle: 'Dog Lovers Meetup',
      longText: 'Join us for a fun afternoon with Shiba Inus!',
      eventImageUrl: `https://material.angular.io/assets/img/examples/shiba2.jpg`,
      eventImageAlt: 'Photo of a Shiba Inu',
    },
    {
      id: 1,
      title: 'Tech Conference',
      subtitle: 'Exploring the Latest Technologies',
      longText: 'Join us for a conference to learn about the latest technologies and trends in the industry.',
      eventImageUrl: `https://assets-global.website-files.com/6331e19fdfcbe01f4c12b610/640f82ab5d300300a891d92a_viva.jpeg`,
      eventImageAlt: 'Photo of a tech conference',
    },
    {
      id: 2,
      title: 'Art Exhibition',
      subtitle: 'Celebrating Creativity',
      longText: 'Experience the beauty of art at our exhibition showcasing various forms of creativity.',
      eventImageUrl: `https://www.jacksonsart.com/blog/wp-content/uploads/2020/01/Mall-Gallery-Main-Gallery-Exhibition-Hire.jpg`,
      eventImageAlt: 'Photo of an art exhibition',
    },
    
  ];
}
