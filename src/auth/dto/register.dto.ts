import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator'

export class RegisterDto {
  @IsString()
  displayName: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
