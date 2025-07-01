import { Controller, Get, Logger } from "@nestjs/common";
import { SubscriptionsService } from "./subscription.service";
import { NotifyEvent } from "@repo/api/index";

@Controller("subscriptions")
export class SubscriptionController {
    private readonly logger = new Logger(SubscriptionController.name);
    constructor(private readonly subscriptionsService: SubscriptionsService) { }
    @Get()
    async getSubscriptions() {
        this.subscriptionsService.publishEvent(new NotifyEvent());
        return [];    // Logic to retrieve subscriptions
    }
}