import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(@Body() payload: { batchId: string; status: string }) {
    const { batchId, status } = payload;
    if (status === 'completed') {
      await this.webhookService.processBatch(batchId);
    }
    return { message: 'Webhook received' };
  }
}
