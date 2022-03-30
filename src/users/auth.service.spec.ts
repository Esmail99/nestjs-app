import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  const usersService: Partial<UsersService> = {};

  beforeEach(async () => {
    const users: User[] = [];

    usersService.findOneByEmail = (email: string) => {
      const user = users.find((user) => user.email === email);

      if (!user) {
        return Promise.resolve(null);
      }

      return Promise.resolve(user);
    };

    usersService.create = ({ email, password }) => {
      const user = {
        id: Math.floor(Math.random() * 9999),
        email,
        password,
      } as User;

      users.push(user);

      return Promise.resolve(user);
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('Rgister', () => {
    it('should fail due to existing user', async () => {
      await authService.register({
        email: 'test@test.com',
        password: '123',
      });

      try {
        const user = await authService.register({
          email: 'test@test.com',
          password: '123',
        });

        expect(user).toBeFalsy();
      } catch (err) {
        expect(err.message).toBe('Account already exists');
      }
    });

    it('should create a new user with salt and hash password', async () => {
      const user = await authService.register({
        email: 'asd@asd.com',
        password: '123',
      });

      const [salt, hash] = user.password.split('5');

      expect(user.password).not.toBe('123');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });
  });

  describe('Login', () => {
    it('should fail due to user not found', async () => {
      try {
        const user = await authService.login({
          email: 'test@test.com',
          password: '123',
        });

        expect(user).not.toBeDefined();
      } catch (err) {
        expect(err.message).toBe('Account does not exist');
      }
    });

    it('should fail due to wrong password', async () => {
      try {
        await authService.register({ email: 'test@test.com', password: '123' });

        const user = await authService.login({
          email: 'test@test.com',
          password: 'asds',
        });

        expect(user).not.toBeDefined();
      } catch (err) {
        expect(err.message).toBe('wrong password!');
      }
    });

    it('should login successfuly', async () => {
      await authService.register({ email: 'test@test.com', password: '456' });

      const user = await authService.login({
        email: 'test@test.com',
        password: '456',
      });

      expect(user).toBeDefined();
    });
  });
});
