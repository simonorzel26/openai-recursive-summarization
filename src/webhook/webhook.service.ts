import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs/promises';

@Injectable()
export class WebhookService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processBatch(batchId: string): Promise<void> {
    const batch = await this.retrieveBatch(batchId);
    const outputFileId = batch.output_file_id;

    const fileResponse = await this.openai.files.content(outputFileId);
    const fileContents = await fileResponse.text();

    await fs.writeFile('batch_output.jsonl', fileContents);

    const lines = fileContents.split('\n').filter(Boolean);
    for (const line of lines) {
      const parsed = JSON.parse(line);
      this.callUnknownFunction(parsed);
    }
  }

  async retrieveBatch(batchId: string) {
    const batch = await this.openai.batches.retrieve(batchId);
    return batch;
  }

  callUnknownFunction(data: any) {
    console.log('Processed Data:', data);
  }
}
