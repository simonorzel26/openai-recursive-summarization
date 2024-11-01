import { WebhookParams } from 'src/webhook/webhook.controller';

// Updated buildWebhookUrl function to match the type
export function buildWebhookUrl(
  baseUrl: string,
  params: WebhookParams,
): string {
  return `${baseUrl}/webhook/${params.internalId}/${params.summarizationRetrievalWebhookURL}/${params.summaryMaxTokenCount}/${params.batchId}/${params.status}`;
}
