import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { EventsController } from "./events.controller";
import { EventSchema } from "./entities/event.entity";
import { createKeyv } from "@keyv/redis";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
    imports: [
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
