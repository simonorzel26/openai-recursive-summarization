import { SegmentationInput, SegmentationOutput } from '../types';

export function segmentText(input: SegmentationInput): SegmentationOutput {
  const { text, maxTokenCount } = input;
  const words = text.split(' ');
  const segments: string[] = [];
  let currentSegment = '';

  words.forEach((word) => {
    if (
      currentSegment.split(' ').length + word.split(' ').length <=
      maxTokenCount
    ) {
      currentSegment += word + ' ';
    } else {
      segments.push(currentSegment.trim());
      currentSegment = word + ' ';
    }
  });

  if (currentSegment.length > 0) {
    segments.push(currentSegment.trim());
  }

  return {
    summarizationPrompt: input.summarizationPrompt,
    segmentedTexts: segments,
  };
}
