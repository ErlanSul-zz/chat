import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersFriendsEntity } from './users-friends.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UsersEntity, UsersFriendsEntity]),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
