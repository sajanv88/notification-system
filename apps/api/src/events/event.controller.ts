import { Body, Controller, Get, HttpException, Param, Patch, Put, Query, UseInterceptors } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { FindEventDto } from "./dtos/find-event.dto";
import { CreateEventDto } from "./dtos/create-event.dto";

@Controller("events")
@UseInterceptors(CacheInterceptor)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    async listAllEvents() {
        return this.eventsService.listAllEvents();
    }



    @Get("/find")
    async findByCityAndDateRange(@Query() findEventDto: FindEventDto) {
        try {
            console.log("Finding events with DTO:", findEventDto);
            return await this.eventsService.findByCityAndDateRange(findEventDto);
        } catch (error) {
            console.error("Error finding events:", error);
            throw new HttpException("Failed to find events", 400);
        }
    }


    @Get(":eventId")
    async findById(@Param("eventId") eventId: string) {
        try {
            const event = await this.eventsService.findById(eventId);
            if (!event) {
                throw new HttpException("Event not found", 404);
            }
            return event;
        } catch (error) {
            console.error("Error finding event by ID:", error);
            throw new HttpException("Failed to find event", 400);
        }
    }

    @Put()
    async createEvent(@Body() createEventDto: CreateEventDto) {
        try {
            return await this.eventsService.createEvent(createEventDto);
        } catch (error) {
            console.error("Error creating event:", error);
            throw new HttpException("Failed to create event", 400);
        }
    }

    @Patch()
    async updateEvent(@Query("eventId") eventId: string, @Body() updates: Partial<CreateEventDto>) {
        try {
            return await this.eventsService.updateEvent(eventId, updates);
        } catch (error) {
            console.error("Error updating event:", error);
            throw new HttpException("Failed to update event", 400);
        }
    }



}