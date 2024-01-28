import { Location } from '../event';

export function formatLocation(location: string | Location): string {
  if (typeof location === 'string') {
    return location;
  } else {
    return `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
  }
}

export function getGoogleMapsUrl(location: string | Location): string {
  let address: string;
  if (typeof location === 'string') {
    address = location;
  } else {
    address = `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
  }
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}
