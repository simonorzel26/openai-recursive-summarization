import { WebhookParams } from 'src/webhook/webhook.controller';
import { buildWebhookUrl } from './buildWebhookUrl';

describe('buildWebhookUrl', () => {
  it('should build the correct URL given valid parameters', () => {
    const baseUrl = 'https://example.com';
    const params: WebhookParams = {
      internalId: '12345',
      status: 'completed',
      batchId: '67890',
      maxTokenCount: 100,
    };

    const expectedUrl = 'https://example.com/webhook/12345/completed/67890/100';
    const result = buildWebhookUrl(baseUrl, params);

    expect(result).toBe(expectedUrl);
  });

  it('should handle different base URLs correctly', () => {
    const baseUrl = 'http://localhost:3000';
    const params: WebhookParams = {
      internalId: 'abcde',
      status: 'in-progress',
      batchId: 'xyz123',
      maxTokenCount: 50,
    };

    const expectedUrl =
      'http://localhost:3000/webhook/abcde/in-progress/xyz123/50';
    const result = buildWebhookUrl(baseUrl, params);

    expect(result).toBe(expectedUrl);
  });

  it('should handle edge cases where maxTokenCount is 0', () => {
    const baseUrl = 'https://test.com';
    const params: WebhookParams = {
      internalId: '00000',
      status: 'failed',
      batchId: 'testbatch',
      maxTokenCount: 0,
    };

    const expectedUrl = 'https://test.com/webhook/00000/failed/testbatch/0';
    const result = buildWebhookUrl(baseUrl, params);

    expect(result).toBe(expectedUrl);
  });
});
