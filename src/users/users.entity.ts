import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 255, unique: true })
  @Expose()
  username: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  constructor(users: Partial<UsersEntity>) {
    Object.assign(this, users);
  }
}
