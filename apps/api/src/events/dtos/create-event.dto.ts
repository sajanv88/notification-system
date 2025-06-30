import { EventStatus } from "@repo/api/enums/event-status.enum";

export class CreateEventDto {
    artistId: string;
    venueId: string;
    city: string;
    date: Date;
    status: EventStatus;
    changes: string[];
}