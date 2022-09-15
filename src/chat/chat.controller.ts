import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import express from 'express';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ChatEntity } from './chat.entity';

@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async Chat(
    @Req() req: express.Request,
    @Query('user_id', ParseIntPipe) userId: number,
  ): Promise<ChatEntity[]> {
    return await this.chatService.getMessages(req, userId);
  }
}
