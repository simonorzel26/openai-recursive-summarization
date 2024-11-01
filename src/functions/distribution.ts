import { isWithinTokenLimit } from 'gpt-tokenizer';

export interface DistributionInput {
  textToSummarize: string;
  maxTokenCount: number;
}

export interface DistributionOutput {
  finishedSummary: boolean;
}

export function distributeSummary({
  textToSummarize,
  maxTokenCount,
}: DistributionInput): DistributionOutput {
  if (textToSummarize === '') {
    return {
      finishedSummary: true,
    };
  }
  const isCompatible = isWithinTokenLimit(textToSummarize, maxTokenCount);

  return {
    finishedSummary: isCompatible ? true : false,
  };
}
