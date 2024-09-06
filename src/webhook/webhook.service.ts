import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs/promises'; // Use promises for async file operations

@Injectable()
export class WebhookService {
  private openai: OpenAI;

  constructor() {
    // Initialize the OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in the environment variables
    });
  }

  async processBatch(batchId: string): Promise<void> {
    // First, retrieve the batch object (you'll need to implement this part to fetch the batch details)
    const batch = await this.retrieveBatch(batchId);
    const outputFileId = batch.output_file_id;

    // Retrieve the output file content via the Files API using the output_file_id
    const fileResponse = await this.openai.files.content(outputFileId);
    const fileContents = await fileResponse.text();

    // Log the file contents or save it to disk
    await fs.writeFile('batch_output.jsonl', fileContents);

    // Parse and process each line in the .jsonl file
    const lines = fileContents.split('\n').filter(Boolean);
    for (const line of lines) {
      const parsed = JSON.parse(line);
      // Call your unknown function with the parsed response data
      this.callUnknownFunction(parsed);
    }
  }

  async retrieveBatch(batchId: string) {
    // You will need to implement this method to retrieve batch details
    // This is a mock implementation, adapt it as per OpenAI's API
    const batch = await this.openai.batches.retrieve(batchId);
    return batch; // Ensure the batch object has the output_file_id field
  }

  callUnknownFunction(data: any) {
    // Process data here (you can implement logic to store the data, call another service, etc.)
    console.log('Processed Data:', data);
  }
}
