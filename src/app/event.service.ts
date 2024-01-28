import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event } from './event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([
    {
      id: '0',
      title: 'Shiba Inu Gathering',
      longDescription: 'Dog Lovers Meetup',
      shortDescription: 'Join us for a fun afternoon with Shiba Inus!',
      location: {
          street: 'Röda vägen 2',
          city: 'Borlänge',
          country: 'Sweden'
      },
      organizer: 'Shiba Inu Club',
      startDate: new Date(),
      endDate: new Date(),
      eventImageUrl: `https://material.angular.io/assets/img/examples/shiba2.jpg`,
      eventImageAlt: 'Photo of a Shiba Inu',
  },
  {
      id: '1',
      title: 'TechFrontiers 2024',
      organizer: 'Tech Conference Inc.',
      startDate: new Date(),
      startTime: {
          hour: 9,
          minute: 0
      },
      endDate: new Date(),
      endTime: {
          hour: 17,
          minute: 0
      },
      location: {
          city: 'Sälen',
          country: 'Sweden'
      },
      eventImageUrl: `https://assets-global.website-files.com/6331e19fdfcbe01f4c12b610/640f82ab5d300300a891d92a_viva.jpeg`,
      eventImageAlt: 'Photo of a tech conference',
      shortDescription: 'Unveiling the Next Wave of Technological Breakthroughs',
      longDescription: `
      **Join Us at TechFrontiers 2024: Unveiling the Next Wave of Technological Breakthroughs**
      
      **Date:** August 11-13, 2024  
      **Venue:** Silicon Valley Convention Center, California  
      **Website:** [www.techfrontiers2024.com](#)
      
      ---
      
      Are you ready to dive into the heart of innovation and witness the future of technology unfold? TechFrontiers 2024 is the pinnacle event for tech enthusiasts, industry leaders, innovators, and visionaries. This three-day conference, held at the prestigious Silicon Valley Convention Center, promises an enlightening journey through the latest technological advancements and trends shaping our world.
      
      **What to Expect:**
      - **Keynote Speeches:** Be inspired by leading minds in technology, including pioneers from Silicon Valley, renowned scientists, and influential CEOs. They will share insights into cutting-edge developments and future tech landscapes.
      - **Interactive Workshops:** Engage in hands-on workshops led by experts. Topics range from Artificial Intelligence and Machine Learning to Green Technology and Cybersecurity.
      - **Tech Expo:** Experience a dazzling display of the latest gadgets and innovations. Witness firsthand the newest products and prototypes from top tech companies and promising startups.
      - **Networking Opportunities:** Connect with like-minded professionals, potential collaborators, and industry leaders. Expand your professional network and uncover opportunities in this dynamic environment.
      - **Panel Discussions:** Participate in thought-provoking discussions on various topics, including the impact of technology on society, the future of work, and emerging tech markets.
      
      **Who Should Attend:**
      TechFrontiers 2024 is perfect for IT professionals, entrepreneurs, researchers, students, and anyone passionate about technology. Whether you're seeking to stay ahead of the curve, explore career opportunities, or simply indulge your curiosity, this conference is for you.
      
      **Registration & Details:**
      Early bird registration opens on April 1, 2024. For more information, visit our website at [www.techfrontiers2024.com](#). Join us in shaping the future of innovation at TechFrontiers 2024 – where technology meets possibility!
      `,
  },
  {
      id: '2',
      title: 'Art Exhibition',
      longDescription: 'Celebrating Creativity',
      shortDescription: 'Experience the beauty of art at our exhibition showcasing various forms of creativity.',
      location: {
          city: 'Paris',
          country: 'France'
      },
      organizer: 'Art Gallery',
      startDate: new Date(),
      startTime: {
          hour: 10,
          minute: 0
      },
      endDate: new Date(),
      endTime: {
          hour: 18,
          minute: 0
      },
      eventImageUrl: `https://www.jacksonsart.com/blog/wp-content/uploads/2020/01/Mall-Gallery-Main-Gallery-Exhibition-Hire.jpg`,
      eventImageAlt: 'Photo of an art exhibition',
  },
  {
      id: '3',
      title: 'Shiba Inu Gathering',
      longDescription: 'Dog Lovers Meetup',
      shortDescription: 'Join us for a fun afternoon with Shiba Inus!',
      location: {
          city: 'Borlänge',
          country: 'Sweden'
      },
      organizer: 'Shiba Inu Club',
      startDate: new Date(),
      endDate: new Date(),
      eventImageUrl: `https://material.angular.io/assets/img/examples/shiba2.jpg`,
      eventImageAlt: 'Photo of a Shiba Inu',
  },
  {
      id: '4',
      title: 'Tech Conference',
      longDescription: 'Exploring the Latest Technologies',
      shortDescription: 'Join us for a conference to learn about the latest technologies and trends in the industry.',
      location: {
          city: 'San Francisco',
          country: 'USA'
      },
      organizer: 'Tech Conference Inc.',
      startDate: new Date(),
      endDate: new Date(),
      eventImageUrl: `https://assets-global.website-files.com/6331e19fdfcbe01f4c12b610/640f82ab5d300300a891d92a_viva.jpeg`,
      eventImageAlt: 'Photo of a tech conference',
  }
  ]);

  events$ = this.eventsSubject.asObservable();

  constructor() {}

  // Method to get current events
  getEvents(): Event[] {
    return this.eventsSubject.getValue();
  }

  // Method to add a new event
  addEvent(newEvent: Event) {
    const events = this.getEvents();
    this.eventsSubject.next([...events, newEvent]);
  }

  // Additional methods like updateEvent, deleteEvent, etc. can be added here
}
