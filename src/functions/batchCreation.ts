import { createBatchFromRequests } from './gptBatch';

export interface BatchCreationInput {
  summarizationPrompt: string;
  segmentedTexts: string[];
  cleanedWebhookUrl: string;
}

export interface BatchCreationOutput {
  completed: boolean;
}

export async function createBatch({
  summarizationPrompt,
  segmentedTexts,
  cleanedWebhookUrl,
}: BatchCreationInput): Promise<BatchCreationOutput> {
  const batchId = await createBatchFromRequests({
    summarizationPrompt,
    segmentedTexts,
    cleanedWebhookUrl,
  });

  const response = await fetch(process.env.BATCH_AWAITER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: batchId,
      webhookUrl: process.env.HOST_DOMAIN,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Error submitting batch:', error);
    return { completed: false };
  }

  return {
    completed: true,
  };
}
