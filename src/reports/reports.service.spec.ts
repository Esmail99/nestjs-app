import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ReportDto } from './dtos/report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let repositoryMockFactory: () => MockType<Repository<any>>;

  beforeEach(async () => {
    repositoryMockFactory = jest.fn(() => ({
      create: jest.fn((entity) => entity),
      save: jest.fn((entity) => ({
        ...entity,
        id: entity.id || Math.floor(Math.random() * 999),
      })),
      findOneBy: jest.fn(({ id }) => ({
        id,
        price: 50,
        make: 'BMW',
        model: 'X3',
        year: 2010,
        latitude: 30.3424,
        longitude: 30.123123,
        mileage: 50,
      })),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(reportsService).toBeDefined();
  });

  describe('Create Report', () => {
    it('should create report successfuly', async () => {
      const reportDto: ReportDto = {
        price: 50,
        make: 'BMW',
        model: 'X3',
        year: 2010,
        latitude: 30.3424,
        longitude: 30.123123,
        mileage: 50,
      };

      const user = {
        id: 1,
        email: 'baba@baba.com',
        password:
          '28005cfdf3ec2cde.81d84b888cc093f02350c92d8f618723027bc59b44d62b1cc8386ca46c2223a5',
      } as User;

      const report = await reportsService.create(reportDto, user);

      expect(report.id).toBeDefined();
      expect(report.price).toBe(reportDto.price);
      expect(report.user.id).toBe(user.id);
      expect(report.user.email).toBe(user.email);
    });
  });

  describe('approve report', () => {
    it('should be approved', async () => {
      const reportId = 1;
      const isApproved = false;
      const report = await reportsService.approve(reportId, isApproved);

      expect(report.id).toBe(reportId);
      expect(report.isApproved).toBe(isApproved);
    });
  });
});
