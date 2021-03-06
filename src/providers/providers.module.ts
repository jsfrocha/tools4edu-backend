import { Module } from '@nestjs/common';
import { ProvidersResolver } from './providers.resolver';
import { ProvidersService } from './providers.service';
import { DB_LANDINGPAGE_CONNECTION } from '../constants';
import { ProviderSchema } from './schemas/providers.schema';
import { VideosModule } from '../videos/videos.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Provider',
        schema: ProviderSchema,
        collection: 'providers'
      }
    ], DB_LANDINGPAGE_CONNECTION),
    VideosModule
  ],
  providers: [
    ProvidersService,
    ProvidersResolver
  ],
  exports: [
    ProvidersService,
    ProvidersResolver
  ]
})
export class ProvidersModule {}
