export interface Event {
    id?: string;
    title: string;
    longDescription: string;
    shortDescription: string;
    startDate: Date;
    endDate?: Date;
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
