import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

@Exclude()
export class LoginUserDto {
  @Expose()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(70)
  readonly username: string;

  @Expose()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(70)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W\w]{5,70}$/, {
    message:
      'Password be at least 5 characters long and that you use a combination of letters, numbers',
  })
  readonly password: string;
}
