import { Module } from '@nestjs/common';
import { EventsModule } from './events/event.module';
import { SubscriptionsModule } from './subscription/subscription.module';
import { NotificationModule } from './notification/notification.module';



@Module({
  imports: [EventsModule, SubscriptionsModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
