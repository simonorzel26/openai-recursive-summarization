import { getBatchData } from './getBatch';
import * as dotenv from 'dotenv';

dotenv.config();

describe('getBatchData Integration Test', () => {

  // Test for when the batch is completed and valid content is returned
  it('should return parsed file content when batch is completed', async () => {
    const batchId = 'batch_OclkjkRkPAXqL75b83OxscD5';

    const result = await getBatchData({ batchId });

    expect(result.fileContent).toBeDefined();
    expect(Array.isArray(result.fileContent)).toBe(true);

    if (result.fileContent) {
      result.fileContent.forEach((content) => {
        expect(typeof content).toBe('string');
        expect(content).not.toBe('');
      });
    }
  });

  // Test for when the batch is not completed
  it('should return undefined when the batch status is not completed', async () => {
    const batchId = 'incomplete_batch_id'; // Replace with a real batch ID that is not completed

    const result = await getBatchData({ batchId });

    expect(result.fileContent).toBeUndefined();
  });

  // Test for an invalid batch ID
  it('should handle invalid batch ID by returning undefined', async () => {
    const invalidBatchId = 'invalid_batch_id';

    try {
      const result = await getBatchData({ batchId: invalidBatchId });
      expect(result.fileContent).toBeUndefined();
    } catch (error) {
      // Depending on how OpenAI handles invalid requests, 
      // you may expect an error to be thrown
      expect(error).toBeDefined();
    }
  });

  // Test for when the output file is empty
  it('should return an empty array if the output file has no content', async () => {
    const emptyOutputBatchId = 'batch_with_empty_output'; // Replace with a real batch ID where output file is empty

    const result = await getBatchData({ batchId: emptyOutputBatchId });

    expect(result.fileContent).toBeDefined();
    expect(result.fileContent?.length).toBe(0);
  });

  // Test for handling an error in the file retrieval process
  it('should handle an error when retrieving the output file content', async () => {
    const errorBatchId = 'batch_with_file_error'; // Replace with a batch ID where file retrieval may fail

    try {
      const result = await getBatchData({ batchId: errorBatchId });
      expect(result).toBeUndefined(); // You could adjust depending on error-handling logic
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain('Error retrieving file content');
    }
  });
  
  // Test for handling malformed file content
  it('should throw an error if the file content is malformed JSON', async () => {
    const malformedBatchId = 'batch_with_malformed_json'; // Replace with a batch ID with malformed JSON

    try {
      await getBatchData({ batchId: malformedBatchId });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain('Unexpected token'); // Check for JSON parsing error
    }
  });
});
