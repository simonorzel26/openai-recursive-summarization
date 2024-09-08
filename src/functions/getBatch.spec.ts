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

    console.log(result);

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
      expect(error).toBeDefined();
    }
  });
});
