import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(70)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W\w]{5,70}$/, {
    message:
      'Password be at least 5 characters long and that you use a combination of letters, numbers',
  })
  password: string;
}
