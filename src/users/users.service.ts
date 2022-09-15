import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import express from 'express';
import { getUserSession } from '../global.helpers';
import { UsersFriendsEntity } from './users-friends.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersFriendsEntity)
    private readonly usersFriendsRepository: Repository<UsersFriendsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOneByUserName(username: string): Promise<UsersEntity> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findOneByUserId(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOneBy({ id });
  }

  async update(updateUsersDto: Partial<UsersEntity>): Promise<UpdateResult> {
    const userModel = await this.usersRepository.findOneBy({
      id: updateUsersDto.id,
    });
    if (userModel === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (Object.entries(updateUsersDto).length === 0) {
      throw new HttpException('User not modified', HttpStatus.NOT_MODIFIED);
    }

    try {
      return await this.usersRepository.update(userModel.id, updateUsersDto);
    } catch (error) {
      throw new HttpException('User not modified', HttpStatus.BAD_REQUEST);
    }
  }

  async addToFriend(req: express.Request, userId: number): Promise<void> {
    const sessionUserData = getUserSession(req);
    const user = await this.findOneByUserId(userId);

    if (user === null) {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }

    const friend = await this.usersFriendsRepository.findOneBy({
      userId: sessionUserData,
      friendId: user,
    });

    if (friend !== null) {
      throw new HttpException(
        'User is already in the friends list',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.usersFriendsRepository.save([
      {
        userId: sessionUserData,
        friendId: user,
      },
      {
        userId: user,
        friendId: sessionUserData,
      },
    ]);
  }

  async getAllFriends(req: express.Request): Promise<UsersEntity[]> {
    const sessionUserData = getUserSession(req);
    const friends = await this.usersFriendsRepository.find({
      relations: ['friendId'],
      where: { userId: new UsersEntity({ id: sessionUserData.id }) },
    });
    const users: UsersEntity[] = [];

    if (friends.length === 0) {
      return [];
    }
    friends.forEach((friend) => {
      users.push(friend.friendId);
    });
    return users;
  }

  async getAllNotFriends(req: express.Request): Promise<UsersEntity[]> {
    const sessionUserData = getUserSession(req);
    const users = await this.usersRepository
      .createQueryBuilder('users')
      .where(`id != ${sessionUserData.id}`)
      .getMany();
    const friends = await this.getAllFriends(req);
    if (friends.length === 0) {
      return users;
    }

    if (JSON.stringify(friends) === JSON.stringify(users)) {
      return [];
    }

    return users
      .map((user) => {
        const fr = friends.find((friend) => friend.id === user.id);
        if (fr === undefined) {
          return user;
        }
      })
      .filter((item) => item !== undefined);
  }
}
