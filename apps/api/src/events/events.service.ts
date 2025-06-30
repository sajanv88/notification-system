import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Event } from "@repo/api/entities/event.entity";
import { CreateEventDto } from "./dtos/create-event.dto";
import { FindEventDto } from "./dtos/find-event.dto";

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<Event>, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    async listAllEvents(): Promise<Array<Event>> {
        return this.eventModel.find().exec();
    }

    async createEvent(createEventDto: CreateEventDto): Promise<{ eventId: string }> {
        const createdEvent = new this.eventModel(createEventDto);
        await createdEvent.save();
        return { eventId: createdEvent._id.toString() };
    }

    async findByCityAndDateRange({ city, startDate, endDate }: FindEventDto) {
        const cacheKey = `events:${city}:${startDate}:${endDate}`;

        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return JSON.parse(cached as string);

        const events = await this.eventModel.find({
            city,
            date: { $gte: startDate, $lte: endDate },
            status: 'scheduled'
        }).exec();

        await this.cacheManager.set(cacheKey, JSON.stringify(events), 1000);
        return events;
    }

    async findById(eventId: string): Promise<Event | null> {
        const cacheKey = `event:${eventId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return JSON.parse(cached as string);
        const event = await this.eventModel.findById(eventId).exec();
        if (event) {
            await this.cacheManager.set(cacheKey, JSON.stringify(event), 1000);
        }
        return event;
    }

    async updateEvent(eventId: string, updates: Partial<CreateEventDto>) {
        const updated = await this.eventModel.findByIdAndUpdate(
            eventId,
            { $set: updates, $push: { changes: updates } },
            { new: true }
        ).exec();

        // Invalidate cache
        await this.cacheManager.del(`events:*`);

        return updated;
    }
}