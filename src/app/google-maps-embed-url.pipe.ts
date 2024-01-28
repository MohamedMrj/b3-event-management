import { Pipe, PipeTransform } from '@angular/core';
import { Location } from './event';
import { getGoogleMapsEmbedUrl } from './utils/location.utils';

@Pipe({
  name: 'googleMapsEmbedUrl'
})
export class GoogleMapsEmbedUrlPipe implements PipeTransform {
  transform(location: string | Location): string {
    return getGoogleMapsEmbedUrl(location);
  }
}
