export interface Event {
    id?: string;
    title: string;
    longDescription: string;
    shortDescription: string;
    startDateTime: string;
    endDateTime: string;
    timezone: string;
    location: EventLocation;
    organizer: string;
    eventImageUrl: string;
    eventImageAlt: string;
}
export interface EventLocation {
    street?: string;
    city: string;
    country: string;
}
