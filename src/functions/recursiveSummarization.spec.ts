import {
  recursiveSummarization,
  RecursiveSummarizationInput,
} from './recursiveSummarization';
import { getBatchData } from './getBatch';
import { createBatch } from './batchCreation';
import { cleanSummaryId } from './cleanSummaryId';
import { sanitizeInput } from './sanitation';
import { aggregateSummaries } from './aggregation';
import { distributeSummary } from './distribution';
import { segmentText } from './segmentation';

// Mock functions for dependencies that involve external or side-effect behavior
jest.mock('./getBatch');
jest.mock('./batchCreation');
jest.mock('./cleanSummaryId');
jest.mock('./sanitation');
jest.mock('./aggregation');
jest.mock('./distribution');
jest.mock('./segmentation');

describe('recursiveSummarization E2E', () => {
  const payload: RecursiveSummarizationInput = {
    text: 'some long text',
    maxTokenCount: 100,
    prompt: 'Summarize this',
    webhookUrl: 'http://example.com',
    batchId: '123',
    status: 'completed',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking behavior of each imported function for integration purposes
    (cleanSummaryId as jest.Mock).mockReturnValue({
      cleanedWebhookUrl: 'http://cleaned-example.com',
    });
    (getBatchData as jest.Mock).mockResolvedValue({
      fileContent: ['some text from batch'],
    });
    (sanitizeInput as jest.Mock).mockReturnValue({
      sanitizedTextArr: ['sanitized text'],
    });
    (aggregateSummaries as jest.Mock).mockReturnValue({
      combinedSummary: 'aggregated summary',
    });
    (distributeSummary as jest.Mock).mockReturnValue({
      finishedSummary: false,
    });
    (segmentText as jest.Mock).mockReturnValue({
      segmentedTexts: ['segment 1', 'segment 2'],
    });
    (createBatch as jest.Mock).mockResolvedValue({
      completed: true,
    });
  });

  it('should call the correct methods and return void when a batch is created', async () => {
    const result = await recursiveSummarization(payload);

    // Verifying that all the steps in the process were called with expected arguments
    expect(cleanSummaryId).toHaveBeenCalledWith({
      webhookUrl: payload.webhookUrl,
    });
    expect(getBatchData).toHaveBeenCalledWith({ batchId: payload.batchId });
    expect(sanitizeInput).toHaveBeenCalledWith({
      textArr: ['some text from batch'],
    });
    expect(aggregateSummaries).toHaveBeenCalledWith({
      summariesList: ['sanitized text'],
    });
    expect(distributeSummary).toHaveBeenCalledWith({
      text: 'aggregated summary',
      maxTokenCount: payload.maxTokenCount,
    });
    expect(segmentText).toHaveBeenCalledWith({
      text: 'aggregated summary',
      maxTokenCount: payload.maxTokenCount,
    });
    expect(createBatch).toHaveBeenCalledWith({
      summarizationPrompt: payload.prompt,
      segmentedTexts: ['segment 1', 'segment 2'],
      cleanedWebhookUrl: 'http://cleaned-example.com',
    });

    // Since the process isn't finished and a batch is created, it should return void
    expect(result).toBeUndefined();
  });

  it('should return the aggregated summary if finishedSummary is true', async () => {
    // Adjusting the mock for distributeSummary to return true
    (distributeSummary as jest.Mock).mockReturnValueOnce({
      finishedSummary: true,
    });

    const result = await recursiveSummarization(payload);

    // It should return the combined summary
    expect(result).toEqual('aggregated summary');
  });
});
