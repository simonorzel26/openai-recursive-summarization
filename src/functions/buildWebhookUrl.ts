export type WebhookParams = {
  internalId: string;
  status: string;
  batchId: string;
  maxTokenCount: number;
};

export function buildWebhookUrl(
  baseUrl: string,
  params: WebhookParams,
): string {
  return `/webhook/${params.internalId}/${params.status}/${params.batchId}/${params.maxTokenCount}`;
}