import { sanitizeInput } from './sanitation';
import { aggregateSummaries } from './aggregation';
import { distributeSummary } from './distribution';
import { segmentText } from './segmentation';
import { createBatch } from './batchCreation';
import { getBatchData } from './getBatch';
import { buildWebhookUrl } from './buildWebhookUrl';
import { createBatchFromRequests } from './gptBatch';

// New type combining params and payload
export type RecursiveSummarizationInput = {
  textToSummarize: string;
  summaryMaxTokenCount: number;
  summarizationPrompt: string;
  summarizationRetrievalWebhookURL: string;
  internalId: string;
  status: string;
  batchId: string;
};

export async function recursiveSummarization({
  textToSummarize,
  summaryMaxTokenCount,
  summarizationPrompt,
  summarizationRetrievalWebhookURL,
  internalId,
  status,
  batchId,
}: RecursiveSummarizationInput): Promise<string | void> {
  // Retrieve batch data
  const { fileContent } = await getBatchData({ batchId });

  // Sanitize the input text
  const { sanitizedTextArr } = sanitizeInput({
    textArr: fileContent ?? [...textToSummarize],
  });

  // Aggregate sanitized summaries
  const { combinedSummary } = aggregateSummaries({
    summariesArr: sanitizedTextArr,
  });

  // Distribute summary if within max token count
  const { finishedSummary } = distributeSummary({
    textToSummarize: combinedSummary,
    maxTokenCount: summaryMaxTokenCount,
  });

  if (finishedSummary) {
    await fetch(decodeURIComponent(summarizationRetrievalWebhookURL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: finishedSummary,
      }),
    });

    return combinedSummary;
  }

  // Segment text if not finished
  const { segmentedTexts } = segmentText({
    text: combinedSummary,
    maxTokenCount: summaryMaxTokenCount,
  });

  const newBatchId = await createBatchFromRequests({
    summarizationPrompt,
    segmentedTexts,
  });

  const newWebhookUrl = buildWebhookUrl(process.env.HOST_DOMAIN, {
    internalId,
    status,
    batchId: newBatchId,
    summaryMaxTokenCount,
  });

  const { completed } = await createBatch({
    batchId: newBatchId,
    webhookUrl: newWebhookUrl,
  });

  if (!completed) {
    console.error('Error in batch creation');
  }

  return;
}
