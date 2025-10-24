import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;  // <-- definite assignment assertion

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @MinLength(6)
  password!: string; // <-- definite assignment assertion

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  name?: string; // optional, no '!'
}
