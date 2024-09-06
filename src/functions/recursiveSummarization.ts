import { sanitizeInput } from './sanitation';
import { aggregateSummaries } from './aggregation';
import { distributeSummary } from './distribution';
import { segmentText } from './segmentation';
import { createBatch } from './batchCreation';

export async function recursiveSummarization(
  prompt: string,
  text: string,
  maxTokenCount: number,
  summaryId: string,
): Promise<string | void> {
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
    summaryId,
  });

  if (!completed) {
    console.log('Error');
  }

  return;
}
