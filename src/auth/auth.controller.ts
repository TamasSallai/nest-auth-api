import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { GoogleAuthGuard } from './guards/google.guard'
import { GithubAuthGuard } from './guards/github.guard'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Request() req: ExpressRequest, @Body() data: RegisterDto) {
    const user = await this.authService.register(data)

    await new Promise<void>((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) {
          reject(new HttpException('Failed to log in user.', 500))
        }
        resolve()
      })
    })

    return {
      success: true,
      user,
    }
  }

  @Post('/login')
  async login(@Request() req: ExpressRequest, @Body() data: LoginDto) {
    const user = await this.authService.validateLocal(data)

    await new Promise<void>((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) {
          reject(new HttpException('Failed to log in user.', 500))
        }
        resolve()
      })
    })

    return {
      success: true,
      user,
    }
  }

  @Get('/logout')
  logout(@Request() req: ExpressRequest) {
    req.session.destroy((error) => {
      if (error) {
        throw new InternalServerErrorException('Something went wrong')
      }
    })
    return {
      success: true,
      message: 'Logged out successfully.',
    }
  }

  @Get('/profile')
  async profile(@Request() req: ExpressRequest) {
    const user = req.user

    if (!user) {
      throw new UnauthorizedException('Not Authenticated')
    }

    return {
      success: true,
      user,
    }
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Response() res: ExpressResponse) {
    const isMobileClient = false

    if (isMobileClient) {
      return res.redirect(`myapp://auth?token=token`) // To be implemented
    }

    return res.redirect('http://localhost:5713/signin')
  }

  @Get('/github/login')
  @UseGuards(GithubAuthGuard)
  githubLogin() {}

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  githubCallback(@Response() res: ExpressResponse) {
    const isMobileClient = false

    if (isMobileClient) {
      return res.redirect(`myapp://auth?token=token`) // To be implemented
    }

    return res.redirect('http://localhost:5713/signin')
  }
}
