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
