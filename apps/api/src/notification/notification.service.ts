import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
    constructor(@InjectQueue('notifications') private notificationQueue: Queue) { }

    async notifyUser(userId: string, message: string) {
        await this.notificationQueue.add('send-notification', { userId, message });
    }
}