import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'users_friends' })
export class UsersFriendsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id' })
  @Expose()
  userId: UsersEntity;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'friend_id' })
  @Expose()
  friendId: UsersEntity;
}
