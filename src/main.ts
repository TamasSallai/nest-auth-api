import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as passport from 'passport'
import * as session from 'express-session'
import { createClient } from 'redis'
import RedisStore from 'connect-redis'
import { AppModule } from './app.module'

const redisClient = createClient({ url: process.env.REDIS_URL })
redisClient.connect().catch((error: Error) => console.error(error))

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors:
      process.env.NODE_ENV === 'development'
        ? {
            origin: 'http://localhost:5713',
            credentials: true,
          }
        : false,
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api')
  app.use(
    session({
      resave: false,
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(3000)
}
bootstrap()
