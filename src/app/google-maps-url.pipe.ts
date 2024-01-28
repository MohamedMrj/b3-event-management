import { Pipe, PipeTransform } from '@angular/core';
import { Location } from './event';
import { getGoogleMapsUrl } from './utils/location.utils';

@Pipe({
  name: 'googleMapsUrl'
})
export class GoogleMapsUrlPipe implements PipeTransform {
  transform(location: string | Location): string {
    return getGoogleMapsUrl(location);
  }
}
