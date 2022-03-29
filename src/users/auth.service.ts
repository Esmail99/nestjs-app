import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('Account already exists');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    const passwordToBeStored = salt + '.' + hash.toString('hex');

    const newUser = await this.usersService.create({
      email: createUserDto.email,
      password: passwordToBeStored,
    });

    return newUser;
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);

    if (!user) {
      throw new BadRequestException('Account does not exist');
    }

    const [salt, storedPassword] = user.password.split('.');

    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    if (storedPassword !== hash.toString('hex')) {
      throw new BadRequestException('wrong password!');
    }

    return user;
  }
}
