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
