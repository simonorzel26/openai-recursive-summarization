import { Controller, Post, Param, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { z } from 'zod';
import { RecursiveSummarizationInput } from 'src/functions/recursiveSummarization';

// Define Zod schema for WebhookParams
const WebhookParamsSchema = z.object({
  internalId: z.string().min(5),
  status: z.string(),
  batchId: z.string().min(5),
  summaryMaxTokenCount: z.number().min(2),
  summarizationRetrievalWebhookURL: z.string().min(5),
});

// Define Zod schema for WebhookPayload
const WebhookPayloadSchema = z.object({
  textToSummarize: z.string().min(10),
  summarizationPrompt: z.string().min(10),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
export type WebhookParams = z.infer<typeof WebhookParamsSchema>;

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(
    ':internalId/:summarizationRetrievalWebhookURL/:summaryMaxTokenCount/:batchId/:status',
  )
  async handleWebhook(
    @Param() params: WebhookParams,
    @Body() payload: WebhookPayload,
  ) {
    params.summaryMaxTokenCount = Number(params.summaryMaxTokenCount);
    // Validate and parse the params
    try {
      WebhookParamsSchema.parse(params);
    } catch (error) {
      console.log('Invalid params', error);
      return { success: false, error: 'Invalid params' };
    }

    // Validate and parse the payload
    try {
      WebhookPayloadSchema.parse(payload);
    } catch (error) {
      console.log('Invalid params', error);
      return { success: false, error: 'Invalid payload' };
    }

    if (payload && params) {
      const completePayload: RecursiveSummarizationInput = {
        textToSummarize: payload.textToSummarize,
        summaryMaxTokenCount: params.summaryMaxTokenCount,
        summarizationPrompt: payload.summarizationPrompt,
        summarizationRetrievalWebhookURL:
          params.summarizationRetrievalWebhookURL,
        internalId: params.internalId,
        status: params.status,
        batchId: params.batchId,
      };

      await this.webhookService.processBatch(completePayload);
    }
    return { success: true };
  }
}
