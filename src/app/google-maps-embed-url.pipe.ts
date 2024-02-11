import { Pipe, PipeTransform } from '@angular/core';
import { Event } from './event';
import { getGoogleMapsEmbedUrl } from './utils/location.utils';

@Pipe({
  name: 'googleMapsEmbedUrl',
  standalone: true,
})
export class GoogleMapsEmbedUrlPipe implements PipeTransform {
  transform(event: Event): string {
    const { locationStreet, locationCity, locationCountry } = event;
    return getGoogleMapsEmbedUrl(
      locationStreet ?? '',
      locationCity,
      locationCountry,
    );
  }
}
