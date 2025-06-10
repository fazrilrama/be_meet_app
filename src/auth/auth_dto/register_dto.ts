import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsNumber()
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
