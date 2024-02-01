import { Pipe, PipeTransform } from '@angular/core';
import { EventLocation } from './event';
import { getGoogleMapsUrl } from './utils/location.utils';

@Pipe({
  name: 'googleMapsUrl'
})
export class GoogleMapsUrlPipe implements PipeTransform {
  transform(location: string | EventLocation): string {
    return getGoogleMapsUrl(location);
  }
}
