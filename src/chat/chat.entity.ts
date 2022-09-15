import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { UsersEntity } from '../users/users.entity';

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  @Expose()
  id: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'from_user' })
  @Expose()
  fromUser: UsersEntity;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'to_user' })
  @Expose()
  toUser: UsersEntity;

  @Column({ name: 'text', unique: true })
  @Expose()
  text: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  constructor(chat: Partial<ChatEntity>) {
    Object.assign(this, chat);
  }
}
