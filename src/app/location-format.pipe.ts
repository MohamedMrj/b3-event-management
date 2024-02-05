import { Pipe, PipeTransform } from '@angular/core';
import { Event } from './event';
import { formatLocation } from './utils/location.utils';

@Pipe({
  name: 'locationFormat',
})
export class LocationFormatPipe implements PipeTransform {
  transform(event: Event): string {
    const { locationStreet, locationCity, locationCountry } = event;
    return formatLocation(locationStreet, locationCity, locationCountry);
  }
}
