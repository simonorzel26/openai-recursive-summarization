import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import * as recursiveSummarizationModule from 'src/functions/recursiveSummarization';
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
    it('should call recursiveSummarization with the correct payload and execute the flow E2E', async () => {
      const payload: RecursiveSummarizationInput = {
        text: 'some text',
        maxTokenCount: 100,
        prompt: 'some prompt',
        webhookUrl: 'http://example.com',
        batchId: '123',
        status: 'completed',
      };

      // Spy on the recursiveSummarization function to ensure it is called
      const recursiveSummarizationSpy = jest
        .spyOn(recursiveSummarizationModule, 'recursiveSummarization')
        .mockResolvedValue('aggregated summary');

      // Call the processBatch function which internally calls recursiveSummarization
      await webhookService.processBatch(payload);

      // Verify that recursiveSummarization was called with the correct payload
      expect(recursiveSummarizationSpy).toHaveBeenCalledWith({
        text: payload.text,
        maxTokenCount: payload.maxTokenCount,
        prompt: payload.prompt,
        webhookUrl: payload.webhookUrl,
        batchId: payload.batchId,
        status: payload.status,
      });

      // Clear the spy after the test
      recursiveSummarizationSpy.mockRestore();
    });
  });
});
