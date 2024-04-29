import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GBFSSystemClass,
  GBFSSystemSchema,
} from 'src/gbfs-system/gbfs-system.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // OBS: Regarding testing and mocking the mongoDb
        // For using { MongoMemoryServer } from 'mongodb-memory-server' in NestJs e2e tests see my answere in Stackoverflow:
        // https://stackoverflow.com/a/77245292/8430632
        uri: configService.get<string>('MONGO_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: GBFSSystemClass.name, schema: GBFSSystemSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
