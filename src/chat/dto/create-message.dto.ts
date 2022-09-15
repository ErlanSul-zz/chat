import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class CreateMessageDto {
  @Expose()
  @IsNotEmpty()
  text: string;

  @Expose()
  @IsNotEmpty()
  fromUser: number;

  @Expose()
  @IsNotEmpty()
  toUser: number;

  @Expose()
  @IsNotEmpty()
  username: string;
}
