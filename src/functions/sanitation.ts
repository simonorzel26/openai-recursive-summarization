export interface SanitationInput {
  textArr: string[];
}

export interface SanitationOutput {
  sanitizedTextArr: string[];
}

export function sanitizeInput({ textArr }: SanitationInput): SanitationOutput {
  const sanitizedTextArr = textArr.map((text) => {
    return text.replace(/\s\s+/g, ' ').trim();
  });
  return {
    sanitizedTextArr,
  };
}
