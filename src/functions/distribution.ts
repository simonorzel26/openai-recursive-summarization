export interface DistributionInput {
  text: string;
  maxTokenCount: number;
}

export interface DistributionOutput {
  finishedSummary: boolean;
}

function countTokens(text: string) {
  return text.trim().split(/\s+/).length;
}

export function distributeSummary({
  text,
  maxTokenCount,
}: DistributionInput): DistributionOutput {
  const tokenCount = countTokens(text);
  const isCompatible = tokenCount <= maxTokenCount;

  if (isCompatible) {
    return {
      finishedSummary: true,
    };
  }

  return {
    finishedSummary: false,
  };
}
