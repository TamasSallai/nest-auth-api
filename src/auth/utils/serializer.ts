import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super()
  }

  serializeUser(user: any, done: Function) {
    console.log('Serialize:', user)
    done(null, user)
  }

  deserializeUser(payload: any, done: Function) {
    console.log('Deserialize:', payload)
    done(null, payload)
  }
}
