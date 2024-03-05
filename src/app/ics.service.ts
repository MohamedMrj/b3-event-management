import { Injectable } from '@angular/core';
import { Event } from './event';

@Injectable({
  providedIn: 'root'
})
export class IcsService {

  constructor() { }

  // Function to generate ICS content
  generateICS(event: Event): string {
    if (!event) {
      console.error('Event data is not available');
      return '';
    }

    const title = event.title;
    const description = this.formatIcsText(event.shortDescription);
    const startDateTime = this.formatDateForIcs(new Date(event.startDateTime));
    const endDateTime = this.formatDateForIcs(new Date(event.endDateTime));
    const location = [
      event.locationStreet,
      event.locationCity,
      event.locationCountry
    ].filter(part => part).join(' ');
    const event_url = event.id ? `https://wonderful-coast-0fa0b0703.4.azurestaticapps.net/event/${event.id}` : '';

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Your Organization//EN",
      "BEGIN:VEVENT",
      `DTSTAMP:${this.formatDateForIcs(new Date())}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `URL:${event_url}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }

  // Function to download the ICS file
  downloadICS(icsContent: string, fileName: string) {
    if (!icsContent) {
      console.error('ICS content is empty');
      return;
    }

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, '_');
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${sanitizedFileName}.ics`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  formatDateForIcs(date: Date): string {
    return [
      date.getUTCFullYear(),
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      date.getUTCDate().toString().padStart(2, '0'),
      'T',
      date.getUTCHours().toString().padStart(2, '0'),
      date.getUTCMinutes().toString().padStart(2, '0'),
      date.getUTCSeconds().toString().padStart(2, '0'),
      'Z'
    ].join('');
  }

  formatIcsText(text: string): string {
    let result = '';
    text = text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
    while (text.length > 0) {
      const line = text.substring(0, 75);
      text = text.substring(75);
      result += (result ? '\r\n ' : '') + line;
    }
    return result;
  }
}
