import { Controller, Get } from "@nestjs/common";
import { SubscriptionsService } from "./subscription.service";
import { NotifyEvent } from "@repo/api/index";

@Controller("subscriptions")
export class SubscriptionController {

    constructor(private readonly subscriptionsService: SubscriptionsService) { }
    @Get()
    getSubscriptions() {
        this.subscriptionsService.publishEvent(new NotifyEvent());
        return [];    // Logic to retrieve subscriptions
    }
}