import * as bcrypt from 'bcrypt'
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    const { email, password, oauthProvider } = data

    const user = await this.findOneByEmail(email)

    if (user) {
      throw new ConflictException('User with email already exists.')
    }

    if (!oauthProvider && !password) {
      throw new BadRequestException('Password is required.')
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      data.password = passwordHash
    }

    return this.prismaService.user.create({
      data,
    })
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  async findOneById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    })
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOneById(id)

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    return this.prismaService.user.update({
      where: { id },
      data,
    })
  }

  async remove(id: string) {
    await this.findOneById(id)

    return this.prismaService.user.delete({
      where: { id },
    })
  }
}
