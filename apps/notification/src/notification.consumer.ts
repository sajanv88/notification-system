import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from 'bullmq';

import { Logger } from "@nestjs/common";

@Processor("notifications")
export class NotificationConsumer extends WorkerHost {
    private readonly logger = new Logger(NotificationConsumer.name);
    async process(job: Job) {
        // Logic to process the notification job
        this.logger.log("Processing notification job:", JSON.stringify(job));
    }

    @OnWorkerEvent("active")
    onActivate(job: Job) {
        this.logger.log("Notification consumer activated for job:", job.id);
    }

    @OnWorkerEvent("completed")
    onCompleted(job: Job) {
        this.logger.log("Notification job completed:", job.id);
    }

    @OnWorkerEvent("failed")
    onFailed(job: Job, error: Error) {
        this.logger.error(`Notification job failed: ${job.id}`, error);
    }

    @OnWorkerEvent("error")
    onError(error: Error) {
        this.logger.error("Notification consumer error:", error);
    }

    @OnWorkerEvent("drained")
    onDrained() {
        this.logger.log("Notification consumer drained");
    }

    @OnWorkerEvent("closing")
    onClosing() {
        this.logger.log("Notification consumer is closing");
    }

    @OnWorkerEvent("closed")
    onClosed() {
        this.logger.log("Notification consumer has closed");
    }

    @OnWorkerEvent("paused")
    onPaused() {
        this.logger.log("Notification consumer is paused");
    }

    @OnWorkerEvent("resumed")
    onResumed() {
        this.logger.log("Notification consumer has resumed");
    }
}