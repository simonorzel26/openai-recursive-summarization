import { sanitizeInput } from './sanitation';
import { aggregateSummaries } from './aggregation';
import { distributeSummary } from './distribution';
import { segmentText } from './segmentation';
import { createBatch } from './batchCreation';
import { cleanSummaryId } from './cleanSummaryId';
import { getBatchData } from './getBatch';
export type RecursiveSummarizationInput = {
  text: string;
  maxTokenCount: number;
  prompt: string;
  summaryId: string;
  batchId: string;
  status: string;
};
export async function recursiveSummarization({
  text,
  maxTokenCount,
  prompt,
  summaryId,
  batchId,
  status,
}: RecursiveSummarizationInput): Promise<string | void> {
  const { cleanedSummaryId } = cleanSummaryId({ summaryId });

  const { fileContents } = getBatchData({batchId});

  const { sanitizedText } = sanitizeInput({
    text,
  });

  const { combinedSummary } = aggregateSummaries({
    summariesList: [...sanitizedText],
  });

  const { finishedSummary } = distributeSummary({
    text: combinedSummary,
    maxTokenCount,
  });

  if (finishedSummary) {
    return combinedSummary;
  }

  const { segmentedTexts } = segmentText({
    text: sanitizedText,
    maxTokenCount,
  });

  const { completed } = await createBatch({
    summarizationPrompt: prompt,
    segmentedTexts,
    summaryId: cleanedSummaryId,
  });

  if (!completed) {
    console.log('Error');
  }

  return;
}
