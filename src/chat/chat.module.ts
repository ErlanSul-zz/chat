import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
  imports: [UsersModule, TypeOrmModule.forFeature([ChatEntity])],
})
export class ChatModule {}
