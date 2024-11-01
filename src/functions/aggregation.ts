export interface AggregationInput {
  summariesArr: string[];
}

export interface AggregationOutput {
  combinedSummary: string;
}

export function aggregateSummaries(input: AggregationInput): AggregationOutput {
  const combinedSummaries = input.summariesArr.join(' ');
  return {
    combinedSummary: combinedSummaries,
  };
}
