import { DistributionInput, DistributionOutput } from '../types';

export function distributeSummary(
  input: DistributionInput,
): DistributionOutput {
  const isCompatible = input.tokenCount <= 4096;

  if (isCompatible) {
    return {
      finalSummary: input.text,
      summarizationPrompt: input.summarizationPrompt,
      text: input.text,
      tokenCount: input.tokenCount,
    };
  }

  return {
    summarizationPrompt: input.summarizationPrompt,
    text: input.text,
    tokenCount: input.tokenCount,
  };
}
