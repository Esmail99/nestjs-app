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
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/current-user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('/register')
  async registerUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body);

    session.userId = user.id;

    return user;
  }

  @Post('/login')
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login(body);

    session.userId = user.id;

    return user;
  }

  @Get('/logout')
  async logoutUser(@Session() session: any) {
    session.userId = null;

    return 'success';
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
