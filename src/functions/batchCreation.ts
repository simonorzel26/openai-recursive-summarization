import { BatchCreationInput, BatchCreationOutput } from '../types';
import { writeFileSync } from 'fs';
import { join } from 'path';

export function createBatch(input: BatchCreationInput): BatchCreationOutput {
  const batchFile = join(__dirname, 'batch.jsonl');
  const batchData = input.dividedTexts.map((text) => ({
    prompt: input.summarizationPrompt,
    text,
  }));

  writeFileSync(
    batchFile,
    batchData.map((item) => JSON.stringify(item)).join('\n'),
    'utf-8',
  );

  return {
    batchFile,
    webhookUrl: 'https://example.com/webhook',
  };
}
