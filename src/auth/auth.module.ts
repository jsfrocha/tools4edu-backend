import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';


@Module({
  imports: [],
  providers: [
    AuthService,
    AuthResolver
  ],
  exports: [
    AuthService,
    AuthResolver
  ]
})
export class AuthModule {}
