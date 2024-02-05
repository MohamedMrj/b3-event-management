export interface Event {
  id?: string;
  title: string;
  longDescription: string;
  shortDescription: string;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  locationStreet?: string;
  locationCity: string;
  locationCountry: string;
  organizer: string;
  imageUrl: string;
  imageAlt: string;
}
