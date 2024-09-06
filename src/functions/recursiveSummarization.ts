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
}: RecursiveSummarizationInput): Promise<string | void> {
  const { cleanedSummaryId } = cleanSummaryId({ summaryId });

  const { fileContent } = await getBatchData({ batchId });

  const { sanitizedTextArr } = sanitizeInput({
    textArr: fileContent ?? [...text],
  });

  const { combinedSummary } = aggregateSummaries({
    summariesList: sanitizedTextArr,
  });

  const { finishedSummary } = distributeSummary({
    text: combinedSummary,
    maxTokenCount,
  });

  if (finishedSummary) {
    return combinedSummary;
  }

  const { segmentedTexts } = segmentText({
    text: combinedSummary,
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
