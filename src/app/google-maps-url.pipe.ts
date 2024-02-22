import { Pipe, PipeTransform } from '@angular/core';
import { Event } from './event'; // Assuming this is the correct path to your Event interface
import { getGoogleMapsUrl } from './utils/location.utils';

@Pipe({
  name: 'googleMapsUrl',
  standalone: true,
})
export class GoogleMapsUrlPipe implements PipeTransform {
  transform(event: Event): string {
    const { locationStreet, locationCity, locationCountry } = event;
    return getGoogleMapsUrl(locationStreet ?? '', locationCity, locationCountry);
  }
}
