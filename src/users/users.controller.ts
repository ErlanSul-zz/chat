import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UsersFriendsEntity } from './users-friends.entity';
import express from 'express';
import { UsersEntity } from './users.entity';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/friend')
  async addToFriend(
    @Req() req: express.Request,
    @Query('user_id', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.userService.addToFriend(req, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/friends')
  async getAllFriends(@Req() req: express.Request): Promise<UsersEntity[]> {
    return await this.userService.getAllFriends(req);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/not-friends')
  async getAllNotFriends(@Req() req: express.Request): Promise<UsersEntity[]> {
    return await this.userService.getAllNotFriends(req);
  }
}
