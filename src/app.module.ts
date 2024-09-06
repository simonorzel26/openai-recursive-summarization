import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [WebhookModule, ConfigModule.forRoot()],
})
export class AppModule {}
