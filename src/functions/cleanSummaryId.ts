import { v4 as uuidv4 } from 'uuid';

export function cleanSummaryId({ summaryId }: { summaryId: string }): {
  cleanedSummaryId: string;
} {
  const summaryIdWithoutUuid = summaryId.split('-')[0];
  const id = uuidv4();
  const cleanedSummaryId = `${summaryIdWithoutUuid}-${id}`;

  return { cleanedSummaryId };
}
