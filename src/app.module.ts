import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ChatModule } from './chat/chat.module';
import { ChatEntity } from './chat/chat.entity';
import { UsersEntity } from './users/users.entity';
import { UsersFriendsEntity } from './users/users-friends.entity';
import { ChatGateway } from './chat/chat.gateway';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

export const configService = new ConfigService('conf-local.env');

@Module({
  imports: [
    UsersModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      name: configService.databaseConnectionName,
      host: configService.databaseHost,
      port: configService.databasePort,
      username: configService.databaseUser,
      password: configService.databasePassword,
      database: configService.databaseName,
      synchronize: configService.databaseSynchronize,
      logging: configService.databaseLogging,
      extra: {
        connectionTimeoutMillis: configService.databaseConnectionTimeout,
        idleTimeoutMillis: 2000,
        max: 10,
      },
      entities: [ChatEntity, UsersEntity, UsersFriendsEntity],
    }),
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
