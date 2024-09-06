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
