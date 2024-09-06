import { SanitationInput, SanitationOutput } from '../types';

export function sanitizeInput(input: SanitationInput): SanitationOutput {
  const sanitizedText = input.text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .trim();
  return {
    summarizationPrompt: input.summarizationPrompt,
    sanitizedText,
  };
}
