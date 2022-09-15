import { SetMetadata } from '@nestjs/common';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';

export const UserRoles = (...roles: string[]): CustomDecorator<'roles'> =>
  SetMetadata('roles', roles);
