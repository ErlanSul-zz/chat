import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async registration(
    createUserDto: CreateUserDto,
  ): Promise<Partial<UsersEntity>> {
    const userCheck = await this.usersService.findOneByUserName(
      createUserDto.username,
    );
    if (userCheck !== null) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const userModel = new UsersEntity({
      username: createUserDto.username,
    });

    userModel.password = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.usersRepository.save(userModel);
      const { password, ...rest } = user;
      return rest;
    } catch (error) {
      console.log('User created error', error);
      throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<Partial<UsersEntity>> {
    const user = await this.usersService.findOneByUserName(
      loginUserDto.username,
    );

    if (user === null) {
      throw new HttpException(
        'Invalid password or user not found',
        HttpStatus.FORBIDDEN,
      );
    }
    const passwordEquals = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (passwordEquals) {
      const { password, ...rest } = user;
      return rest;
    }
    throw new HttpException(
      'Invalid password or user not found',
      HttpStatus.FORBIDDEN,
    );
  }
}
