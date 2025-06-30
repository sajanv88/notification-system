import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NotificationService } from "./notification.service";
import { CqrsModule } from "@nestjs/cqrs";
import { NotificationEventHandler } from "./notification-event.handler";

@Module({
    imports: [
        CqrsModule,
        ConfigModule.forRoot(),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({ name: "notifications" })
    ],
    controllers: [],
    providers: [NotificationService, NotificationEventHandler],
})
export class NotificationModule { }