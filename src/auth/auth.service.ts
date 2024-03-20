import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ValidateOauthDto } from './dto/validate-oauth.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(data: RegisterDto) {
    const user = await this.usersService.findOneByEmail(data.email)

    if (user) {
      throw new ConflictException('User with email already exists.')
    }

    const newUser = await this.usersService.create(data)

    return {
      id: newUser.id,
      displayName: newUser.displayName,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    }
  }

  async validateLocal({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) throw new UnauthorizedException('Invalid email or password.')

    if (user.oauthProvider)
      throw new UnauthorizedException(
        `Login with your ${user.oauthProvider} account.`,
      )

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword)
      throw new UnauthorizedException('Invalid email or password.')

    return {
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }
  }

  async validateOauth(data: ValidateOauthDto) {
    const user = await this.usersService.findOneByEmail(data.email)

    if (!user) return this.usersService.create(data)

    return {
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }
  }
}
