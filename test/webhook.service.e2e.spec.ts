import { Test, TestingModule } from '@nestjs/testing';
import { RecursiveSummarizationInput } from '../src/functions/recursiveSummarization';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { WebhookModule } from '../src/webhook/webhook.module';
import { getBatchData } from '../src/functions/getBatch';

jest.mock('../src/functions/getBatch');

describe('WebhookService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebhookModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should summarize large text', async () => {
    const largeText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const payload: RecursiveSummarizationInput = {
      text: largeText,
      maxTokenCount: 100,
      prompt: 'Please summarize the following text:',
      webhookUrl: 'http://localhost:3000/webhook',
      batchId: 'batch123',
      status: '',
    };

    (getBatchData as jest.Mock).mockResolvedValue({
      fileContent: ['Mock batch data'],
    });

    const response = await request(app.getHttpServer())
      .post('/webhook')
      .send(payload)
      .expect(201);

    expect(response.body).toBeDefined();
  });

  afterEach(async () => {
    await app.close();
  });
});
