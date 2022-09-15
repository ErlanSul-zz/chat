import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import express from 'express';
import { UsersEntity } from '../users/users.entity';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { getUserSession } from '../global.helpers';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: false }))
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Req() req: express.Request,
  ): Promise<Partial<UsersEntity>> {
    return await this.authService.registration(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: express.Request): any {
    return { user: req.user, msg: 'User logged in' };
  }

  @Get('checkhealth')
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  checkHealth(@Req() req: express.Request, @Res() res: express.Response): void {
    const sessionUserData = getUserSession(req);

    if (sessionUserData === null) {
      throw new HttpException('Session expired', HttpStatus.UNAUTHORIZED);
    }
    res.send({
      id: sessionUserData.id,
      username: sessionUserData.username,
    });
  }

  @Get('/logout')
  logout(@Req() req: express.Request): { msg: string } {
    req.session.destroy((err: any) => {
      console.log(err);
    });
    return { msg: 'The user session has ended' };
  }
}
