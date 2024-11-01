export interface BatchCreationInput {
  batchId: string;
  webhookUrl: string;
}

export interface BatchCreationOutput {
  completed: boolean;
}

export async function createBatch({
  batchId,
  webhookUrl,
}: BatchCreationInput): Promise<BatchCreationOutput> {
  const response = await fetch(process.env.BATCH_AWAITER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: batchId,
      webhookUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Error submitting batch:', error);
    return { completed: false };
  }

  return {
    completed: true,
  };
}
