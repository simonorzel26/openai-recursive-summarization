import { createBatchFromRequests } from './gptBatch';

export interface BatchCreationInput {
  summarizationPrompt: string;
  segmentedTexts: string[];
  summaryId: string;
}

export interface BatchCreationOutput {
  completed: boolean;
}

export async function createBatch({
  summarizationPrompt,
  segmentedTexts,
  summaryId,
}: BatchCreationInput): Promise<BatchCreationOutput> {
  const batchId = await createBatchFromRequests({
    summarizationPrompt,
    segmentedTexts,
    summaryId,
  });

  const response = await fetch(process.env.BATCH_AWAITER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: batchId,
      webhookUrl: process.env.HOST_DOMAIN,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Batch submitted successfully:', data);
  } else {
    console.error('Failed to submit batch:', response.statusText);
    // retry or error handling
  }

  return {
    completed: true,
  };
}
