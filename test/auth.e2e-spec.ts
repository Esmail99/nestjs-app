import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('register successfuly', () => {
    const email = 'asda@asdsasdas.co';
    return request(app.getHttpServer())
      .post('/users/register')
      .send({ email, password: '123' })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(typeof res.body.id).toBe('number');
        expect(res.body.email).toBe(email);
        expect(res.body.password).toBeUndefined();
      });
  });
});
