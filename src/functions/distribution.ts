import { isWithinTokenLimit } from 'gpt-tokenizer';

export interface DistributionInput {
  text: string;
  maxTokenCount: number;
}

export interface DistributionOutput {
  finishedSummary: boolean;
}

export function distributeSummary({
  text,
  maxTokenCount,
}: DistributionInput): DistributionOutput {
  if (text === '') {
    return {
      finishedSummary: true,
    };
  }
  const isCompatible = isWithinTokenLimit(text, maxTokenCount);

  return {
    finishedSummary: isCompatible ? true : false,
  };
}
