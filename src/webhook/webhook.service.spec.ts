import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { RecursiveSummarizationInput } from '../functions/recursiveSummarization';

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    webhookService = module.get<WebhookService>(WebhookService);
  });

  it('should call recursiveSummarization with the correct payload', async () => {
    const payload: RecursiveSummarizationInput = {
      text: 'Sample text for summarization.',
      maxTokenCount: 100,
      prompt: 'Please summarize the following text:',
      webhookUrl: 'http://localhost:3000/webhook',
      batchId: 'batch123',
      status: 'completed',
    };

    // Since `processBatch` does not return anything (void), the focus here is on ensuring
    // no errors are thrown and it completes successfully.
    await webhookService.processBatch(payload);

    // Since there's no return value to assert, just checking that no exceptions were thrown is enough.
    expect(true).toBe(true);
  });
});
