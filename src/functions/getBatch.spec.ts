import { Test, TestingModule } from '@nestjs/testing';
import { getBatchData } from './getBatch';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

describe('getBatchData Integration Test', () => {
  it('should return parsed file content when batch is completed', async () => {
    const batchId = 'batch_OclkjkRkPAXqL75b83OxscD5'; // Use a real batch ID here

    const result = await getBatchData({ batchId });

    // Check if the function returns a valid array of contents
    expect(result.fileContent).toBeDefined();
    expect(Array.isArray(result.fileContent)).toBe(true);

    // Optionally, you can further validate that the content array has expected elements
    if (result.fileContent) {
      result.fileContent.forEach((content) => {
        expect(typeof content).toBe('string');
        expect(content).not.toBe('');
      });
    }
  });
});
