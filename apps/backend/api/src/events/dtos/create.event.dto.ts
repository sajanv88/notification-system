import { EventStatus } from "../enums/event.status";

export class CreateEventDto {
    artistId: string;
    venueId: string;
    city: string;
    date: Date;
    status: EventStatus;
    changes: string[];
}

