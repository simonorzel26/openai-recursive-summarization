import { AggregationInput, AggregationOutput } from '../types';

export function aggregateSummaries(input: AggregationInput): AggregationOutput {
  const combinedSummaries = [
    ...input.parallelSummaries,
    ...(input.batchSummaries || []),
  ].join(' ||| ');
  return {
    summarizationPrompt: input.summarizationPrompt,
    combinedSummary: combinedSummaries,
  };
}
