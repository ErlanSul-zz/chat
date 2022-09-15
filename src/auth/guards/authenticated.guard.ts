import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import express from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest<express.Request>();
    return request.isAuthenticated();
  }
}
