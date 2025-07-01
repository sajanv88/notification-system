import { Injectable, Logger } from "@nestjs/common";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { NotifyEvent, TestEvent } from "@repo/api/index";

@Injectable()
export class SubscriptionsService {

    private readonly logger = new Logger(SubscriptionsService.name);
    constructor(private readonly eventBus: EventBus, private readonly queryBus: QueryBus) { }

    publishEvent(event: NotifyEvent) {
        this.eventBus.publish(event);
    }

    query(queryEvent: TestEvent) {
        this.queryBus.execute(queryEvent).catch(error => {
            this.logger.warn(error.message);
        });
    }
}