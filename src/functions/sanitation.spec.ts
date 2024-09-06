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
    it('should return the same text if no extra spaces are present', () => {
      const input: SanitationInput = { text: 'Hello World!' };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedText).toBe('Hello World!');
    });

    it('should replace multiple spaces with a single space', () => {
      const input: SanitationInput = { text: 'Hello   World!' };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedText).toBe('Hello World!');
    });

    it('should trim leading and trailing spaces', () => {
      const input: SanitationInput = { text: '   Hello World!   ' };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedText).toBe('Hello World!');
    });

    it('should handle empty string input', () => {
      const input: SanitationInput = { text: '' };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedText).toBe('');
    });

    it('should handle strings with only spaces', () => {
      const input: SanitationInput = { text: '    ' };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedText).toBe('');
    });

    it('should handle strings with mixed spaces and characters', () => {
      const input: SanitationInput = { text: '   Hello   World!   ' };
      const output: SanitationOutput = sanitizeService.sanitizeInput(input);
      expect(output.sanitizedText).toBe('Hello World!');
    });
  });
});
