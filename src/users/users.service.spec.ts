import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
      () => ({
        findOne: jest.fn((entity) => entity),
      }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
