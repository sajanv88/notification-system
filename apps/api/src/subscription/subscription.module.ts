import { Module } from "@nestjs/common";
import { createKeyv } from "@keyv/redis";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Subscription, SubscriptionSchema } from "@repo/api/entities/subscription.entity";
import { SubscriptionsService } from "./subscription.service";
import { CqrsModule } from "@nestjs/cqrs";
import { SubscriptionController } from "./subscription.controller";

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
    controllers: [SubscriptionController],
    providers: [SubscriptionsService, {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor
    }],
})
export class SubscriptionsModule { }