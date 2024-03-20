import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-github2'
import { AuthService } from '../auth.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['read:user', 'user:email'],
    })
  }

  async validate(_: string, __: string, profile: Profile) {
    const user = await this.authService.validateOauth({
      displayName: profile.displayName,
      email: profile.emails[0].value,
      oauthProvider: 'GITHUB',
      oauthId: profile.id,
    })

    return user
  }
}
