export interface BatchCreationInput {
  summarizationPrompt: string;
  segmentedTexts: string[];
}

export interface BatchCreationOutput {
  completed: boolean;
}

export async function createBatch({
  summarizationPrompt,
  segmentedTexts,
}: BatchCreationInput): Promise<BatchCreationOutput> {
  const batchData = segmentedTexts.map((text) => ({
    prompt: summarizationPrompt,
    text,
  }));

  // Upload openai batch file
  console.log(batchData);

  // Call batch awaiter

  return {
    completed: true,
  };
}
