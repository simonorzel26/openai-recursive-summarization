import { AllocationInput, AllocationOutput } from '../types';

export function allocateTokens(input: AllocationInput): AllocationOutput {
  const tokenCount = countTokens(input.text);
  return {
    summarizationPrompt: input.summarizationPrompt,
    text: input.text,
    tokenCount,
  };
}
function countTokens(text: string) {
  return text.trim().split(/\s+/).length;
}
