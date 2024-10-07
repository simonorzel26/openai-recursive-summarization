import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WebhookModule } from '../src/webhook/webhook.module'; // Import the module that contains WebhookController and WebhookService
import { WebhookPayload } from '../src/webhook/webhook.controller';

describe('WebhookController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebhookModule], // Import the correct module containing the controller and service
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should process completed webhook payload and return success', async () => {
    const payload: WebhookPayload = {
      text: 'Sample text for summarization.',
      maxTokenCount: 100,
      prompt: 'Please summarize the following text:',
      webhookUrl: 'http://localhost:3000/webhook',
      batchId: 'batch123',
      status: 'completed',
    };

    const response = await request(app.getHttpServer())
      .post('/webhook') // The endpoint you're testing
      .send(payload)
      .expect(201); // Expecting a 201 status code for successful resource creation

    expect(response.body).toEqual({ success: true });
  });

  it('should return success even if status is not completed', async () => {
    const payload: WebhookPayload = {
      text: 'Sample text for summarization.',
      maxTokenCount: 100,
      prompt: 'Please summarize the following text:',
      webhookUrl: 'http://localhost:3000/webhook',
      batchId: 'batch123',
      status: 'pending', // Not completed status
    };

    const response = await request(app.getHttpServer())
      .post('/webhook')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({ success: true });
  });
});
