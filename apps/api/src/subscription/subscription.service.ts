import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { NotifyEvent } from "@repo/api/index";

@Injectable()
export class SubscriptionsService {

    constructor(private readonly eventBus: EventBus) { }

    publishEvent(event: NotifyEvent) {
        this.eventBus.publish(event);
    }
}