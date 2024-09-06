export interface SegmentationInput {
  text: string;
  maxTokenCount: number;
}

export interface SegmentationOutput {
  segmentedTexts: string[];
}

export function segmentText({
  text,
  maxTokenCount,
}: SegmentationInput): SegmentationOutput {
  const textTokens = text.split(' ');
  const segments: string[][] = [];

  for (let i = 0; i < textTokens.length; i += maxTokenCount) {
    const segment = textTokens.slice(i, i + maxTokenCount);
    segments.push(segment);
  }

  return {
    segmentedTexts: segments.map((segment) => segment.join(' ')),
  };
}
