export interface AggregationInput {
  summariesList: string[];
}

export interface AggregationOutput {
  combinedSummary: string;
}

export function aggregateSummaries(input: AggregationInput): AggregationOutput {
  const combinedSummaries = input.summariesList.join(' ');
  return {
    combinedSummary: combinedSummaries,
  };
}
