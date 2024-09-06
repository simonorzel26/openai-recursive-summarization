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

  console.log(batchId);

  // Call batch awaiter

  return {
    completed: true,
  };
}
