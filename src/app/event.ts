export interface Event {
    id: string;
    title: string;
    longDescription: string;
    shortDescription: string;
    startDate: Date;
    endDate?: Date;
    startTime?: Time;
    endTime?: Time;
    allDayEvent?: boolean;
    location: Location;
    organizer: string;
    eventImageUrl: string;
    eventImageAlt: string;
}

export interface Time {
    hour: number;
    minute: number;
}

export interface Location {
    street?: string;
    city: string;
    country: string;
}
