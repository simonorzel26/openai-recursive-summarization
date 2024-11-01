import { WebhookParams } from 'src/webhook/webhook.controller';
import { buildWebhookUrl } from './buildWebhookUrl';

describe('buildWebhookUrl', () => {
  it('should build the correct URL given valid parameters', () => {
    const baseUrl = 'https://example.com';
    const params: WebhookParams = {
      internalId: '12345',
      status: 'completed',
      batchId: '67890',
      summaryMaxTokenCount: 100,
      summarizationRetrievalWebhookURL: 'webhook-url',
    };

    const expectedUrl =
      'https://example.com/webhook/12345/webhook-url/100/67890/completed';
    const result = buildWebhookUrl(baseUrl, params);

    expect(result).toBe(expectedUrl);
  });

  it('should handle different base URLs correctly', () => {
    const baseUrl = 'http://localhost:3000';
    const params: WebhookParams = {
      internalId: 'abcde',
      status: 'in-progress',
      batchId: 'xyz123',
      summaryMaxTokenCount: 50,
      summarizationRetrievalWebhookURL: 'test-url',
    };

    const expectedUrl =
      'http://localhost:3000/webhook/abcde/test-url/50/xyz123/in-progress';
    const result = buildWebhookUrl(baseUrl, params);

    expect(result).toBe(expectedUrl);
  });

  it('should handle edge cases where summaryMaxTokenCount is 1', () => {
    const baseUrl = 'https://test.com';
    const params: WebhookParams = {
      internalId: '00000',
      status: 'failed',
      batchId: 'testbatch',
      summaryMaxTokenCount: 1,
      summarizationRetrievalWebhookURL: 'special-url',
    };

    const expectedUrl =
      'https://test.com/webhook/00000/special-url/1/testbatch/failed';
    const result = buildWebhookUrl(baseUrl, params);

    expect(result).toBe(expectedUrl);
  });
});
