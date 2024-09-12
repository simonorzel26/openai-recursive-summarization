import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WebhookPayload } from './webhook.controller';

describe('WebhookController', () => {
  let webhookController: WebhookController;
  let webhookService: WebhookService;

  const mockWebhookService = {
    processBatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: mockWebhookService,
        },
      ],
    }).compile();

    webhookController = module.get<WebhookController>(WebhookController);
    webhookService = module.get<WebhookService>(WebhookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleWebhook', () => {
    it('should call processBatch if status is "completed"', async () => {
      const payload: WebhookPayload = {
        text: 'some text',
        maxTokenCount: 100,
        prompt: 'some prompt',
        webhookUrl: 'http://example.com',
        batchId: '123',
        status: 'completed',
      };

      await webhookController.handleWebhook(payload);

      expect(webhookService.processBatch).toHaveBeenCalledWith(payload);
    });

    it('should not call processBatch if status is not "completed"', async () => {
      const payload: WebhookPayload = {
        text: 'some text',
        maxTokenCount: 100,
        prompt: 'some prompt',
        webhookUrl: 'http://example.com',
        batchId: '123',
        status: 'processing',
      };

      await webhookController.handleWebhook(payload);

      expect(webhookService.processBatch).not.toHaveBeenCalled();
    });

    it('should return a message when webhook is received', async () => {
      const payload: WebhookPayload = {
        text: 'some text',
        maxTokenCount: 100,
        prompt: 'some prompt',
        webhookUrl: 'http://example.com',
        batchId: '123',
        status: 'processing',
      };

      const result = await webhookController.handleWebhook(payload);

      expect(result).toEqual({ message: 'Webhook received' });
    });
  });
});
