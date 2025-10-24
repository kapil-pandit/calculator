import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;  // <-- definite assignment assertion

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  password!: string; // <-- definite assignment assertion
}
