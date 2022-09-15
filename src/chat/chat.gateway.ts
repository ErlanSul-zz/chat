import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatEntity } from './chat.entity';
import { UsersEntity } from '../users/users.entity';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @WebSocketServer() server: Server;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly logger: Logger = new Logger('AppGateway');

  afterInit(server: Server): void {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    const chatModule = new ChatEntity({
      fromUser: new UsersEntity({ id: payload.fromUser }),
      toUser: new UsersEntity({ id: payload.toUser }),
      text: payload.text,
      createdAt: new Date(),
    });

    await this.chatService.createMessage(chatModule);
    this.server.emit('chatToClient', chatModule);
    this.server.on('connection', function (client) {
      console.log(client);
    });
  }
}
