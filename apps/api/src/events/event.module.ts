import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { createKeyv } from "@keyv/redis";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Event, EventSchema } from "@repo/api/entities/event.entity"
import { EventsController } from "./event.controller";
import { EventsService } from "./events.service";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
    imports: [
        CqrsModule,
        ConfigModule.forRoot(),
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                stores: [
                    createKeyv(`redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`)
                ],
                ttl: 1000 * 60, // 1 minute,
                cacheId: 'events_cache',
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ],
    controllers: [EventsController],
    providers: [EventsService, {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor
    }],
})
export class EventsModule { }