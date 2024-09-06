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
