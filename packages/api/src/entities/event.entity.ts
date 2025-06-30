import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EventStatus } from "../enums/event-status.enum";

@Schema({ timestamps: true, collection: "events" })
export class Event {
    @Prop({ required: true })
    artistId: string;

    @Prop({ required: true })
    venueId: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ enum: EventStatus, default: EventStatus.SCHEDULED })
    status: EventStatus;

    @Prop()
    changes: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ artistId: 1, venueId: 1, date: 1 }, { unique: true });