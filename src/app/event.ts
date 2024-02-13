export interface Event {
  id?: string;
  title: string;
  longDescription: string;
  shortDescription: string;
  startDateTime: string;
  endDateTime: string;
  locationStreet?: string;
  locationCity: string;
  locationCountry: string;
  organizer: string;
  image: string;
  imageAlt: string;
}
