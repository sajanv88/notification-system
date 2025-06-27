import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Subscription {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    artistId: string;

    @Prop({ required: true })
    city: string;

    @Prop({ type: Map, of: Boolean, default: {} })
    notificationPreferences: Map<string, boolean>;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
SubscriptionSchema.index({ userId: 1, artistId: 1, city: 1 }, { unique: true });