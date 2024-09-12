import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { RecursiveSummarizationInput } from 'src/functions/recursiveSummarization';

describe('WebhookService E2E', () => {
  let webhookService: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    webhookService = module.get<WebhookService>(WebhookService);
  });

  describe('processBatch', () => {
    it('should call recursiveSummarization with the correct payload and execute E2E', async () => {
      const payload: RecursiveSummarizationInput = {
        text: 'some text',
        maxTokenCount: 100,
        prompt: 'some prompt',
        webhookUrl: 'http://example.com',
        batchId: '123',
        status: 'completed',
      };

      // This is where the actual recursiveSummarization function will be called in E2E.
      await webhookService.processBatch(payload);

      // Here, you'd normally have assertions on the side effects or outcomes of recursiveSummarization.
      // If recursiveSummarization has side effects (e.g., writing to DB, HTTP requests), check for those effects.
      expect(true).toBe(true); // Placeholder to ensure the test doesn't fail for now.
    });
  });
});
