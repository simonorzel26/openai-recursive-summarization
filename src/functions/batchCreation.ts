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
  const batchData = segmentedTexts.map((text) => ({
    prompt: summarizationPrompt,
    text,
  }));

  const batchId = await createBatchFromRequests({
    summarizationPrompt,
    segmentedTexts,
    summaryId,
  });

  console.log(batchData);

  // Call batch awaiter

  return {
    completed: true,
  };
}
