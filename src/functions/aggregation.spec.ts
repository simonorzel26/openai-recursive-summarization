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
