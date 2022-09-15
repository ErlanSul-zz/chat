import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  exports: [AuthService],
})
export class AuthModule {}
