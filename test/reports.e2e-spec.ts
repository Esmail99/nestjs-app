import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ReportDto } from 'src/reports/dtos/report.dto';

describe('Reports routes', () => {
  let app: INestApplication;
  let cookie: string[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const email = 'kaka@test.com';

    const createUserResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({ email, password: '123' });

    cookie = createUserResponse.get('Set-Cookie');
  });

  describe('create report', () => {
    const reportDto: ReportDto = {
      price: 50,
      make: 'BMW',
      model: 'X3',
      year: 2010,
      latitude: 30.3424,
      longitude: 30.123123,
      mileage: 50,
    };

    it('should fail due to user not authenticated', () => {
      return request(app.getHttpServer())
        .post('/reports/create')
        .send(reportDto)
        .expect(403);
    });

    it('should create report successfuly', async () => {
      return request(app.getHttpServer())
        .post('/reports/create')
        .set('Cookie', cookie)
        .send(reportDto)
        .expect(201)
        .then((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.userId).toBe(1);
          expect(res.body.user).toBeUndefined();
          expect(typeof res.body.id).toBe('number');
          expect(res.body.price).toBe(reportDto.price);
          expect(res.body.longitude).toBe(reportDto.longitude);
        });
    });

    it('should fail due to invalid request body', () => {
      const invalidReport = {
        price: '50',
        make: 8762,
        year: '2010',
        longitude: 30.123123,
      };

      return request(app.getHttpServer())
        .post('/reports/create')
        .set('Cookie', cookie)
        .send(invalidReport)
        .expect(400);
    });
  });
});
