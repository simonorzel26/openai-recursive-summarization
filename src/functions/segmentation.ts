import { decode, encode } from 'gpt-tokenizer';

export interface SegmentationInput {
  text: string;
  maxTokenCount: number;
}

export interface SegmentationOutput {
  segmentedTexts: string[];
}

function chunkTextByTokensFast(text: string, maxTokenCount: number): string[] {
  if (text === '') {
    return [''];
  }

  const tokens = encode(text);
  const chunks: number[][] = [];

  const blockSize = Math.floor(maxTokenCount * 0.9);
  let start = 0;

  while (start < tokens.length) {
    const end = Math.min(start + blockSize, tokens.length);
    chunks.push(tokens.slice(start, end));
    start = end;
  }

  if (chunks.length > 1 && chunks[chunks.length - 1].length < blockSize * 0.5) {
    const lastChunk = chunks.pop();
    if (lastChunk) {
      chunks[chunks.length - 1].push(...lastChunk);
    }
  }

  // Ensure each chunk is still within the maxTokenCount limit
  const validChunks = chunks.map((chunk) => {
    if (chunk.length > maxTokenCount) {
      return chunk.slice(0, maxTokenCount);
    }
    return chunk;
  });

  const textChunks = validChunks.map((chunk) => decode(chunk));

  return textChunks;
}

export function segmentText({
  text,
  maxTokenCount,
}: SegmentationInput): SegmentationOutput {
  const segments = chunkTextByTokensFast(text, maxTokenCount);

  return {
    segmentedTexts: segments,
  };
}
