export interface Event {
    id?: string;
    title: string;
    longDescription: string;
    shortDescription: string;
    startDateTime: string;
    endDateTime: string;
    timezone: string;
    location: Location;
    organizer: string;
    eventImageUrl: string;
    eventImageAlt: string;
}
export interface Location {
    street?: string;
    city: string;
    country: string;
}
