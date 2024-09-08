import OpenAI from 'openai';

interface GPTResponse {
  response: {
    response: {
      body: {
        choices: {
          message: {
            content: string;
          };
        }[];
      };
    };
    custom_id: string;
    error?: boolean;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000,
});

export async function getBatchData({
  batchId,
}: {
  batchId: string;
}): Promise<{ fileContent: string[] | undefined }> {
  try {
    const batch = await openai.batches.retrieve(batchId);
    if (batch.status !== 'completed') {
      return { fileContent: undefined };
    }

    const outputFileId = batch.output_file_id;

    const fileResponse = await openai.files.content(outputFileId);
    const fileContent = await fileResponse.text();

    const segmentedSummaryArray: string[] = fileContent
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
      .map((gptResponse) => {
        const response = gptResponse as unknown as GPTResponse['response'];
        const content = response.response?.body.choices[0]?.message?.content;

        return content;
      });

    return { fileContent: segmentedSummaryArray };
  } catch (error) {
    console.error('Error retrieving batch:', error);
    return { fileContent: undefined };
  }
}
