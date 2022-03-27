import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body);

    return user;
  }

  @Put('/update')
  async updateUser(@Body() body: UpdateUserDto) {
    const user = await this.usersService.update(body.id, body);

    return user;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.remove(parseInt(id));

    return user;
  }

  @Get('/')
  async getUsers() {
    const users = await this.usersService.findAll();

    return users;
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return user;
  }
}
