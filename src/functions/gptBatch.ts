import OpenAI from 'openai';
import { randomUUID } from 'crypto';

interface BatchRequest {
  custom_id?: string;
  method: string;
  url: string;
  body: {
    model: string;
    messages: Array<{ role: string; content: string }>;
  };
}

interface FileObject {
  id: string;
  purpose: string;
  filename: string;
  bytes: number;
  created_at: number;
  status: string;
  status_details?: string | undefined;
}

async function prepareAndUploadBatchFile(
  batchRequests: BatchRequest[],
  fileName: string,
): Promise<string> {
  try {
    console.log(`Preparing batch file with ${batchRequests.length} requests`);
    const batchData = batchRequests
      .map((req) => `${JSON.stringify(req)}\n`)
      .join('');

    const buffer = Buffer.from(batchData, 'utf-8');

    console.log(`Created batch file with ${batchRequests.length} requests`);

    const file = new File([buffer], `${fileName}.txt`, {
      type: 'text/plain',
    });

    return await uploadBatchFile(file);
  } catch (error) {
    console.error('Error in prepareAndUploadBatchFile:', error);
    throw error;
  }
}

async function uploadBatchFile(file: File): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 120000,
  });
  try {
    console.log(`Uploading batch file ${file.name}`);
    const fileObject: FileObject = await openai.files.create({
      file: file,
      purpose: 'batch',
    });
    return fileObject.id;
  } catch (error) {
    console.error('Error in uploadBatchFile:', error);
    throw error;
  }
}

async function createBatch(inputFileId: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 120000,
  });

  try {
    console.log(`Creating batch with input file ID ${inputFileId}`);
    const batch: OpenAI.Batch = await openai.batches.create({
      input_file_id: inputFileId,
      endpoint: '/v1/chat/completions',
      completion_window: '24h',
    });
    return batch.id;
  } catch (error) {
    console.error('Error in createBatch:', error);
    throw error;
  }
}

type CreateBatchFromRequestsInput = {
  summarizationPrompt: string;
  segmentedTexts: string[];
};

export const createBatchFromRequests = async ({
  summarizationPrompt,
  segmentedTexts,
}: CreateBatchFromRequestsInput): Promise<string> => {
  try {
    const batchRequests: BatchRequest[] = segmentedTexts.map((segment) => {
      return {
        method: 'POST',
        url: '/v1/chat/completions',
        body: {
          model: process.env.OPENAI_MODEL as string,
          messages: [
            {
              role: 'system',
              content: summarizationPrompt,
            },
            {
              role: 'user',
              content: `${segment}`,
            },
          ],
        },
      };
    });

    const inputFileId = await prepareAndUploadBatchFile(
      batchRequests,
      randomUUID().toString(),
    );

    const batchId: string = await createBatch(inputFileId);
    console.log(`Batch created with ID ${batchId}`);

    return batchId;
  } catch (error) {
    console.error('Error in createBatchFromRequests:', error);
    throw error;
  }
};
