import { EventLocation } from '../event';

export function formatLocation(location: string | EventLocation): string {
  if (typeof location === 'string') {
    return location;
  } else {
    return `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
  }
}

export function getGoogleMapsUrl(location: string | EventLocation): string {
  let address: string;
  if (typeof location === 'string') {
    address = location;
  } else {
    address = `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
  }
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function getGoogleMapsEmbedUrl(location: string | EventLocation): string {
  let address: string;
  if (typeof location === 'string') {
    address = location;
  } else {
    address = `${location.street ? location.street + ', ' : ''}${location.city}, ${location.country}`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
