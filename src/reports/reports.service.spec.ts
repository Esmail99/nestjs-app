import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportDto } from './dtos/report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

describe('ReportsService', () => {
  let reportsService: ReportsService;

  beforeEach(async () => {
    const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
      () => ({
        create: jest.fn((entity) => entity),
        save: jest.fn((entity) => ({
          ...entity,
          id: Math.floor(Math.random() * 999),
        })),
      }),
    );

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

      const report = await reportsService.create(reportDto);

      expect(report.id).toBeDefined();
      expect(report.price).toBe(reportDto.price);
    });
  });
});
