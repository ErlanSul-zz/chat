import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatEntity } from './chat.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import express from 'express';
import { getUserSession } from '../global.helpers';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createMessage(chat: ChatEntity): Promise<ChatEntity> {
    if (chat.text === '') {
      throw new HttpException('Message is empty', HttpStatus.FORBIDDEN);
    }
    return await this.chatRepository.save(chat);
  }

  async getMessages(
    req: express.Request,
    toUser: number,
  ): Promise<ChatEntity[]> {
    const sessionUserData = getUserSession(req);

    const users = await this.chatRepository
      .createQueryBuilder('chat')
      .select([
        'chat.id',
        'chat.fromUser',
        'chat.toUser',
        'chat.text',
        'chat.createdAt',
      ])
      .leftJoin('chat.fromUser', 'fromUser')
      .leftJoin('chat.toUser', 'toUser')
      .addSelect(['fromUser.username', 'fromUser.id'])
      .addSelect(['toUser.username', 'toUser.id'])
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere({
            fromUser: toUser,
            toUser: sessionUserData.id,
          }).orWhere({
            fromUser: sessionUserData.id,
            toUser,
          });
        }),
      )
      .orderBy('chat.createdAt', 'ASC')
      .getMany();
    return users;
  }
}
