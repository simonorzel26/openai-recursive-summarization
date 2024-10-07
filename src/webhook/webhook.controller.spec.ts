import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController, WebhookPayload } from './webhook.controller';
import { WebhookService } from './webhook.service';

describe('WebhookController', () => {
  let webhookController: WebhookController;
  let webhookService: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: {
            processBatch: jest.fn(), // Mock the processBatch method
          },
        },
      ],
    }).compile();

    webhookController = module.get<WebhookController>(WebhookController);
    webhookService = module.get<WebhookService>(WebhookService);
  });

  it('should return { success: true } when status is "completed"', async () => {
    const payload: WebhookPayload = {
      text: 'Sample text for summarization.',
      maxTokenCount: 100,
      prompt: 'Please summarize the following text:',
      webhookUrl: 'http://localhost:3000/webhook',
      batchId: 'batch123',
      status: 'completed',
    };

    const result = await webhookController.handleWebhook(payload);

    // Assert that the processBatch function was called with the payload
    expect(webhookService.processBatch).toHaveBeenCalledWith(payload);
    // Assert that the return value is { success: true }
    expect(result).toEqual({ success: true });
  });

  it('should return { success: true } without calling processBatch when status is not "completed"', async () => {
    const payload: WebhookPayload = {
      text: 'Sample text for summarization.',
      maxTokenCount: 100,
      prompt: 'Please summarize the following text:',
      webhookUrl: 'http://localhost:3000/webhook',
      batchId: 'batch123',
      status: 'pending',
    };

    const result = await webhookController.handleWebhook(payload);

    // Assert that the processBatch function was NOT called
    expect(webhookService.processBatch).not.toHaveBeenCalled();
    // Assert that the return value is { success: true }
    expect(result).toEqual({ success: true });
  });
});
