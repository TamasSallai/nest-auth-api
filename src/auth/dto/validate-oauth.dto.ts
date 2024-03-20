import { IsString, IsEmail } from 'class-validator'
import { OAuthProvider } from '@prisma/client'

export class ValidateOauthDto {
  @IsString()
  displayName: string

  @IsString()
  firstName?: string

  @IsString()
  lastName?: string

  @IsEmail()
  email: string

  @IsString()
  oauthProvider: OAuthProvider

  @IsString()
  oauthId: string
}
