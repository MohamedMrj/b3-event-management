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
  creatorUserId: string;
  image: string;
  imageAlt: string;
}
