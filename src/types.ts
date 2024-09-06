export interface SanitationInput {
  summarizationPrompt: string;
  text: string;
}

export interface SanitationOutput {
  summarizationPrompt: string;
  sanitizedText: string;
}

export interface AggregationInput {
  summarizationPrompt: string;
  parallelSummaries: string[];
  batchSummaries?: string[];
}

export interface AggregationOutput {
  summarizationPrompt: string;
  combinedSummary: string;
}

export interface AllocationInput {
  summarizationPrompt: string;
  text: string;
}

export interface AllocationOutput {
  summarizationPrompt: string;
  text: string;
  tokenCount: number;
}

export interface DistributionInput {
  summarizationPrompt: string;
  text: string;
  tokenCount: number;
}

export interface DistributionOutput {
  finalSummary?: string;
  summarizationPrompt: string;
  text: string;
  tokenCount: number;
}

export interface SegmentationInput {
  summarizationPrompt: string;
  text: string;
  tokenCount: number;
  maxTokenCount: number;
}

export interface SegmentationOutput {
  summarizationPrompt: string;
  segmentedTexts: string[];
}

export interface BatchCreationInput {
  summarizationPrompt: string;
  dividedTexts: string[];
}

export interface BatchCreationOutput {
  batchFile: string;
  webhookUrl: string;
}
