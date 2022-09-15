import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Express.User> {
    const user = await this.authService.validateUser({ username, password });

    if (user === undefined) {
      throw new UnauthorizedException();
    }

    const sessionUserData: Partial<Express.User> = {
      id: user.id,
      username: user.username,
    };

    return sessionUserData as Express.User;
  }
}
