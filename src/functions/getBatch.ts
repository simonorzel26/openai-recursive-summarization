import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'process.env.OPENAI_API_KEY',
  timeout: 120000,
});

export async function getBatchData({
  batchId,
}: {
  batchId: string;
}): Promise<{ fileContents: string }> {
  const batch = await openai.batches.retrieve(batchId);
  const outputFileId = batch.output_file_id;

  const fileResponse = await openai.files.content(outputFileId);
  const fileContents = await fileResponse.text();

  return { fileContents: fileContents };
}
