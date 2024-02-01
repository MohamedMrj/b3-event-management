import { Pipe, PipeTransform } from '@angular/core';
import { EventLocation } from './event';
import { getGoogleMapsEmbedUrl } from './utils/location.utils';

@Pipe({
  name: 'googleMapsEmbedUrl'
})
export class GoogleMapsEmbedUrlPipe implements PipeTransform {
  transform(location: string | EventLocation): string {
    return getGoogleMapsEmbedUrl(location);
  }
}
