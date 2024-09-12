import { v4 as uuidv4 } from 'uuid';

export function cleanSummaryId({ webhookUrl }: { webhookUrl: string }): {
  cleanedWebhookUrl: string;
} {
  const summaryIdWithoutUuid = webhookUrl.split('-')[0];
  const id = uuidv4();
  const cleanedSummaryId = `${summaryIdWithoutUuid}-${id}`;

  return { cleanedWebhookUrl: cleanedSummaryId };
}
