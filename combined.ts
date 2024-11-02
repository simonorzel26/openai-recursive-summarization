// @ts-nocheck
/* eslint-disable */


// ---- src/app.module.ts ----
import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    WebhookModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
})
export class AppModule {}


// ---- src/functions/aggregation.spec.ts ----
import {
  aggregateSummaries,
  AggregationInput,
  AggregationOutput,
} from './aggregation';

describe('aggregateSummaries', () => {
  // Test case for normal input with multiple summaries
  it('should combine multiple summaries into one string', () => {
    const input: AggregationInput = {
      summariesArr: ['Summary 1.', 'Summary 2.', 'Summary 3.'],
    };

    const expectedOutput: AggregationOutput = {
      combinedSummary: 'Summary 1. Summary 2. Summary 3.',
    };

    const result = aggregateSummaries(input);

    expect(result).toEqual(expectedOutput);
  });

  // Test case for an empty summaries list
  it('should return an empty string when summariesList is empty', () => {
    const input: AggregationInput = {
      summariesArr: [],
    };

    const expectedOutput: AggregationOutput = {
      combinedSummary: '',
    };

    const result = aggregateSummaries(input);

    expect(result).toEqual(expectedOutput);
  });

  // Test case for a single summary in the list
  it('should return the single summary when there is only one summary in the list', () => {
    const input: AggregationInput = {
      summariesArr: ['Only one summary.'],
    };

    const expectedOutput: AggregationOutput = {
      combinedSummary: 'Only one summary.',
    };

    const result = aggregateSummaries(input);

    expect(result).toEqual(expectedOutput);
  });

  // Test case for handling summaries with extra spaces
  it('should combine summaries with extra spaces correctly', () => {
    const input: AggregationInput = {
      summariesArr: ['   Summary 1.   ', '  Summary 2. ', 'Summary 3.   '],
    };

    const expectedOutput: AggregationOutput = {
      combinedSummary: '   Summary 1.      Summary 2.  Summary 3.   ', // Expecting to preserve spaces here since the function does not sanitize
    };

    const result = aggregateSummaries(input);

    expect(result).toEqual(expectedOutput);
  });

  // Test case for handling large number of summaries
  it('should handle a large number of summaries and concatenate them correctly', () => {
    const input: AggregationInput = {
      summariesArr: Array(1000).fill('Summary'), // 1000 "Summary" strings
    };

    const expectedOutput: AggregationOutput = {
      combinedSummary: Array(1000).fill('Summary').join(' '),
    };

    const result = aggregateSummaries(input);

    expect(result).toEqual(expectedOutput);
  });
});


// ---- src/functions/aggregation.ts ----
export interface AggregationInput {
  summariesArr: string[];
}

export interface AggregationOutput {
  combinedSummary: string;
}

export function aggregateSummaries(input: AggregationInput): AggregationOutput {
  const combinedSummaries = input.summariesArr.join(' ');
  return {
    combinedSummary: combinedSummaries,
  };
}


// ---- src/functions/batchCreation.ts ----
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


// ---- src/functions/buildWebhookUrl.spec.ts ----
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


// ---- src/functions/buildWebhookUrl.ts ----
import { WebhookParams } from 'src/webhook/webhook.controller';

// Updated buildWebhookUrl function to match the type
export function buildWebhookUrl(
  baseUrl: string,
  params: WebhookParams,
): string {
  return `${baseUrl}/webhook/${params.internalId}/${params.summarizationRetrievalWebhookURL}/${params.summaryMaxTokenCount}/${params.batchId}/${params.status}`;
}


// ---- src/functions/distribution.spec.ts ----
import { Test, TestingModule } from '@nestjs/testing';
import {
  distributeSummary,
  DistributionInput,
  DistributionOutput,
} from './distribution';

describe('DistributeSummaryFunction', () => {
  let distributionService: {
    distributeSummary: (input: DistributionInput) => DistributionOutput;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DistributionService',
          useValue: {
            distributeSummary: (input: DistributionInput) =>
              distributeSummary(input),
          },
        },
      ],
    }).compile();

    distributionService = module.get('DistributionService');
  });

  describe('distributeSummary', () => {
    it('should return finishedSummary: true if text token count is less than or equal to maxTokenCount', () => {
      const input: DistributionInput = {
        textToSummarize: 'Hello World!',
        maxTokenCount: 5,
      };
      const output: DistributionOutput =
        distributionService.distributeSummary(input);
      expect(output.finishedSummary).toBe(true);
    });

    it('should return finishedSummary: false if text token count is greater than maxTokenCount', () => {
      const input: DistributionInput = {
        textToSummarize: 'Hello World from the other side!',
        maxTokenCount: 3,
      };
      const output: DistributionOutput =
        distributionService.distributeSummary(input);
      expect(output.finishedSummary).toBe(false);
    });

    it('should handle exact token count match and return finishedSummary: true', () => {
      const input: DistributionInput = {
        textToSummarize: 'One two three',
        maxTokenCount: 3,
      };
      const output: DistributionOutput =
        distributionService.distributeSummary(input);
      expect(output.finishedSummary).toBe(true);
    });

    it('should handle empty text and return finishedSummary: true', () => {
      const input: DistributionInput = {
        textToSummarize: '',
        maxTokenCount: 1,
      };
      const output: DistributionOutput =
        distributionService.distributeSummary(input);
      expect(output.finishedSummary).toBe(true);
    });

    it('should handle text with only spaces and return finishedSummary: true', () => {
      const input: DistributionInput = {
        textToSummarize: '    ',
        maxTokenCount: 1,
      };
      const output: DistributionOutput =
        distributionService.distributeSummary(input);
      expect(output.finishedSummary).toBe(true);
    });
  });
});


// ---- src/functions/distribution.ts ----
import { isWithinTokenLimit } from 'gpt-tokenizer';

export interface DistributionInput {
  textToSummarize: string;
  maxTokenCount: number;
}

export interface DistributionOutput {
  finishedSummary: boolean;
}

export function distributeSummary({
  textToSummarize,
  maxTokenCount,
}: DistributionInput): DistributionOutput {
  if (textToSummarize === '') {
    return {
      finishedSummary: true,
    };
  }
  const isCompatible = isWithinTokenLimit(textToSummarize, maxTokenCount);

  return {
    finishedSummary: isCompatible ? true : false,
  };
}


// ---- src/functions/getBatch.ts ----
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

// src/functions/getBatch.ts
export async function getBatchData({
  batchId,
}: {
  batchId: string;
}): Promise<{ fileContent: string[] | undefined }> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 120000,
  });
  try {
    try {
      const batch = await openai.batches.retrieve(batchId).catch((error) => {
        console.log(error);
        return undefined;
      });

      if (!batch) {
        console.log(`Batch not found with id ${batchId}`);
        return { fileContent: undefined };
      }
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
  } catch (error) {
    console.error('Error retrieving batch:', error);
    return { fileContent: undefined };
  }
}


// ---- src/functions/gptBatch.ts ----
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


// ---- src/functions/recursiveSummarization.ts ----
import { sanitizeInput } from './sanitation';
import { aggregateSummaries } from './aggregation';
import { distributeSummary } from './distribution';
import { segmentText } from './segmentation';
import { createBatch } from './batchCreation';
import { getBatchData } from './getBatch';
import { buildWebhookUrl } from './buildWebhookUrl';
import { createBatchFromRequests } from './gptBatch';

// New type combining params and payload
export type RecursiveSummarizationInput = {
  textToSummarize: string;
  summaryMaxTokenCount: number;
  summarizationPrompt: string;
  summarizationRetrievalWebhookURL: string;
  internalId: string;
  status: string;
  batchId: string;
};

export async function recursiveSummarization({
  textToSummarize,
  summaryMaxTokenCount,
  summarizationPrompt,
  summarizationRetrievalWebhookURL,
  internalId,
  status,
  batchId,
}: RecursiveSummarizationInput): Promise<string | void> {
  // Retrieve batch data
  const { fileContent } = await getBatchData({ batchId });

  // Sanitize the input text
  const { sanitizedTextArr } = sanitizeInput({
    textArr: fileContent ?? [...textToSummarize],
  });

  // Aggregate sanitized summaries
  const { combinedSummary } = aggregateSummaries({
    summariesArr: sanitizedTextArr,
  });

  // Distribute summary if within max token count
  const { finishedSummary } = distributeSummary({
    textToSummarize: combinedSummary,
    maxTokenCount: summaryMaxTokenCount,
  });

  if (finishedSummary) {
    await fetch(decodeURIComponent(summarizationRetrievalWebhookURL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: finishedSummary,
      }),
    });

    return combinedSummary;
  }

  // Segment text if not finished
  const { segmentedTexts } = segmentText({
    text: combinedSummary,
    maxTokenCount: summaryMaxTokenCount,
  });

  const newBatchId = await createBatchFromRequests({
    summarizationPrompt,
    segmentedTexts,
  });

  const newWebhookUrl = buildWebhookUrl(process.env.HOST_DOMAIN, {
    internalId,
    status,
    batchId: newBatchId,
    summaryMaxTokenCount,
  });

  const { completed } = await createBatch({
    batchId: newBatchId,
    webhookUrl: newWebhookUrl,
  });

  if (!completed) {
    console.error('Error in batch creation');
  }

  return;
}


// ---- src/functions/sanitation.spec.ts ----
import { Test, TestingModule } from '@nestjs/testing';
import { sanitizeInput, SanitationInput, SanitationOutput } from './sanitation';

describe('SanitizeInputFunction', () => {
  let sanitizeService: {
    sanitizeInput: (input: SanitationInput) => SanitationOutput;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'SanitizeService',
          useValue: {
            sanitizeInput: (input: SanitationInput) => sanitizeInput(input),
          },
        },
      ],
    }).compile();

    sanitizeService = module.get('SanitizeService');
  });

  describe('sanitizeInput', () => {
    it('should return the same array if no extra spaces are present', () => {
      const input: SanitationInput = {
        textArr: ['Hello World!', 'Nice to meet you.'],
      };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedTextArr).toEqual([
        'Hello World!',
        'Nice to meet you.',
      ]);
    });

    it('should replace multiple spaces with a single space in each string', () => {
      const input: SanitationInput = {
        textArr: ['Hello   World!', 'Nice    to meet  you.'],
      };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedTextArr).toEqual([
        'Hello World!',
        'Nice to meet you.',
      ]);
    });

    it('should trim leading and trailing spaces in each string', () => {
      const input: SanitationInput = {
        textArr: ['   Hello World!   ', '   Nice to meet you.   '],
      };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedTextArr).toEqual([
        'Hello World!',
        'Nice to meet you.',
      ]);
    });

    it('should handle an array with empty strings', () => {
      const input: SanitationInput = {
        textArr: ['Hello World!', '', 'Nice to meet you.'],
      };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedTextArr).toEqual([
        'Hello World!',
        '',
        'Nice to meet you.',
      ]);
    });

    it('should handle strings with only spaces', () => {
      const input: SanitationInput = {
        textArr: ['    ', 'Hello World!', '   '],
      };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedTextArr).toEqual(['', 'Hello World!', '']);
    });

    it('should handle mixed spaces and characters across multiple strings', () => {
      const input: SanitationInput = {
        textArr: ['   Hello   World!   ', 'Nice   to   meet   you.'],
      };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedTextArr).toEqual([
        'Hello World!',
        'Nice to meet you.',
      ]);
    });
  });
});


// ---- src/functions/sanitation.ts ----
export interface SanitationInput {
  textArr: string[];
}

export interface SanitationOutput {
  sanitizedTextArr: string[];
}

export function sanitizeInput({ textArr }: SanitationInput): SanitationOutput {
  const sanitizedTextArr = textArr.map((text) => {
    return text.replace(/\s\s+/g, ' ').trim();
  });
  return {
    sanitizedTextArr,
  };
}


// ---- src/functions/segmentation.spec.ts ----
import { Test, TestingModule } from '@nestjs/testing';
import {
  segmentText,
  SegmentationInput,
  SegmentationOutput,
} from './segmentation';
import { encode } from 'gpt-tokenizer';

describe('SegmentTextFunction', () => {
  let segmentationService: {
    segmentText: (input: SegmentationInput) => SegmentationOutput;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'SegmentationService',
          useValue: {
            segmentText: (input: SegmentationInput) => segmentText(input),
          },
        },
      ],
    }).compile();

    segmentationService = module.get('SegmentationService');
  });

  describe('segmentText', () => {
    it('should return a single chunk if the text is within the token limit', () => {
      const input: SegmentationInput = {
        text: 'This is a short text.',
        maxTokenCount: 100,
      };
      const output: SegmentationOutput = segmentationService.segmentText(input);
      expect(output.segmentedTexts.length).toBe(1);
      expect(output.segmentedTexts[0]).toBe('This is a short text.');
    });

    it('should return multiple chunks if the text exceeds the token limit', () => {
      const input: SegmentationInput = {
        text: 'A very long text that will exceed the token limit when tokenized'.repeat(
          1000,
        ),
        maxTokenCount: 100,
      };
      const output: SegmentationOutput = segmentationService.segmentText(input);
      expect(output.segmentedTexts.length).toBeGreaterThan(1);
    });

    it('should ensure each chunk is under the token limit', () => {
      const input: SegmentationInput = {
        text: 'A very long text that will exceed the token limit when tokenized'.repeat(
          1000,
        ),
        maxTokenCount: 100,
      };
      const output: SegmentationOutput = segmentationService.segmentText(input);
      output.segmentedTexts.forEach((segment) => {
        const tokens = encode(segment);
        expect(tokens.length).toBeLessThanOrEqual(100);
      });
    });

    it('should handle empty text input', () => {
      const input: SegmentationInput = {
        text: '',
        maxTokenCount: 100,
      };
      const output: SegmentationOutput = segmentationService.segmentText(input);
      expect(output.segmentedTexts).toEqual(['']);
    });

    it('should return a single chunk if the text is exactly at the token limit', () => {
      const input: SegmentationInput = {
        text: 'A '.repeat(50), // Assuming each "A " tokenizes into 2 tokens, this should hit exactly 100 tokens
        maxTokenCount: 100,
      };
      const output: SegmentationOutput = segmentationService.segmentText(input);
      expect(output.segmentedTexts.length).toBe(1);
    });
  });
});


// ---- src/functions/segmentation.ts ----
import { decode, encode } from 'gpt-tokenizer';

export interface SegmentationInput {
  text: string;
  maxTokenCount: number;
}

export interface SegmentationOutput {
  segmentedTexts: string[];
}

function chunkTextByTokensFast(text: string, maxTokenCount: number): string[] {
  if (text === '') {
    return [''];
  }

  const tokens = encode(text);
  const chunks: number[][] = [];

  const blockSize = Math.floor(maxTokenCount * 0.9);
  let start = 0;

  while (start < tokens.length) {
    const end = Math.min(start + blockSize, tokens.length);
    chunks.push(tokens.slice(start, end));
    start = end;
  }

  if (chunks.length > 1 && chunks[chunks.length - 1].length < blockSize * 0.5) {
    const lastChunk = chunks.pop();
    if (lastChunk) {
      chunks[chunks.length - 1].push(...lastChunk);
    }
  }

  // Ensure each chunk is still within the maxTokenCount limit
  const validChunks = chunks.map((chunk) => {
    if (chunk.length > maxTokenCount) {
      return chunk.slice(0, maxTokenCount);
    }
    return chunk;
  });

  const textChunks = validChunks.map((chunk) => decode(chunk));

  return textChunks;
}

export function segmentText({
  text,
  maxTokenCount,
}: SegmentationInput): SegmentationOutput {
  const segments = chunkTextByTokensFast(text, maxTokenCount);

  return {
    segmentedTexts: segments,
  };
}


// ---- src/main.ts ----
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase the body size limit
  app.use(bodyParser.json({ limit: '10mb' })); // Adjust '10mb' as needed
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
}
bootstrap();


// ---- src/webhook/webhook.controller.ts ----
import { Controller, Post, Param, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { z } from 'zod';
import { RecursiveSummarizationInput } from 'src/functions/recursiveSummarization';

// Define Zod schema for WebhookParams
const WebhookParamsSchema = z.object({
  internalId: z.string().min(5),
  status: z.string(),
  batchId: z.string().min(5),
  summaryMaxTokenCount: z.number().min(2),
  summarizationRetrievalWebhookURL: z.string().min(5),
});

// Define Zod schema for WebhookPayload
const WebhookPayloadSchema = z.object({
  textToSummarize: z.any(),
  summarizationPrompt: z.string().min(10),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
export type WebhookParams = z.infer<typeof WebhookParamsSchema>;

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(
    ':internalId/:summarizationRetrievalWebhookURL/:summaryMaxTokenCount/:batchId/:status',
  )
  async handleWebhook(
    @Param() params: WebhookParams,
    @Body() payload: WebhookPayload,
  ) {
    params.summaryMaxTokenCount = Number(params.summaryMaxTokenCount);
    function sanitizeInput(input: string): string {
      return input.replace(/[\x00-\x1F\x7F]/g, ''); // Removes control characters
    }

    // Inside your controller method
    const sanitizedPayload = {
      ...payload,
      textToSummarize:
        typeof payload.textToSummarize === 'string'
          ? sanitizeInput(payload.textToSummarize)
          : payload.textToSummarize,
    };

    WebhookPayloadSchema.parse(sanitizedPayload);
    // Validate and parse the params
    try {
      WebhookParamsSchema.parse(params);
    } catch (error) {
      console.log('Invalid params', error);
      return { success: false, error: 'Invalid params' };
    }

    // Validate and parse the payload
    try {
      WebhookPayloadSchema.parse(payload);
    } catch (error) {
      console.log('Invalid params', error);
      return { success: false, error: 'Invalid payload' };
    }

    if (payload && params) {
      const completePayload: RecursiveSummarizationInput = {
        textToSummarize: payload.textToSummarize,
        summaryMaxTokenCount: params.summaryMaxTokenCount,
        summarizationPrompt: payload.summarizationPrompt,
        summarizationRetrievalWebhookURL:
          params.summarizationRetrievalWebhookURL,
        internalId: params.internalId,
        status: params.status,
        batchId: params.batchId,
      };

      await this.webhookService.processBatch(completePayload);
    }
    return { success: true };
  }
}


// ---- src/webhook/webhook.module.ts ----
import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}


// ---- src/webhook/webhook.service.ts ----
import { Injectable } from '@nestjs/common';
import {
  recursiveSummarization,
  RecursiveSummarizationInput,
} from 'src/functions/recursiveSummarization';

@Injectable()
export class WebhookService {
  constructor() {}

  async processBatch(payload: RecursiveSummarizationInput): Promise<void> {
    recursiveSummarization({ ...payload });
  }
}

