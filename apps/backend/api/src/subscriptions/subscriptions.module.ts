import { Module } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { createKeyv } from "@keyv/redis";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Subscription, SubscriptionSchema } from "./entities/subscription.entity";
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
                cacheId: 'subscriptions_cache',
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
        MongooseModule.forFeature([
            { name: Subscription.name, schema: SubscriptionSchema }
        ]),
    ],
    controllers: [],
    providers: [SubscriptionsService, {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor
    }],
})
export class SubscriptionsModule { }