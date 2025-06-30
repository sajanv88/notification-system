import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotifyEvent } from "@repo/api/index";
import { NotificationService } from "./notification.service";

@EventsHandler(NotifyEvent)
export class NotificationEventHandler implements IEventHandler<NotifyEvent> {
    private readonly logger = new Logger(NotificationEventHandler.name);
    constructor(private readonly ns: NotificationService) { }
    handle(event: NotifyEvent) {
        this.logger.log(`Handling notification event`);
        this.ns.notifyUser("userId", "This is a notification message");
    }
}