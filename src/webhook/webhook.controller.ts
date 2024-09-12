import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
export type WebhookPayload = {
  text: string;
  maxTokenCount: number;
  prompt: string;
  webhookUrl: string;
  batchId: string;
  status: string;
};

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(
    @Body()
    payload: WebhookPayload,
  ) {
    if (payload.status === 'completed') {
      await this.webhookService.processBatch(payload);
    }
    return { message: 'Webhook received' };
  }
}
