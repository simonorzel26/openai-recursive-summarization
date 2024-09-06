export interface SanitationInput {
  text: string;
}

export interface SanitationOutput {
  sanitizedText: string;
}

export function sanitizeInput({ text }: SanitationInput): SanitationOutput {
  const sanitizedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .trim();
  return {
    sanitizedText,
  };
}
