export interface Event {
    id: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    startDate: Date;
    endDate?: Date;
    startTime?: Time;
    endTime?: Time;
    allDayEvent?: boolean;
    location: Location;
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
