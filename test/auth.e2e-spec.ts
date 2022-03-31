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

  it('should register successfuly', () => {
    const email = 'test@test.com';
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

  it('should login successfuly', async () => {
    const email = 'kaka@test.com';
    const password = '123';

    await request(app.getHttpServer())
      .post('/users/register')
      .send({ email, password });

    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(typeof res.body.id).toBe('number');
        expect(res.body.email).toBe(email);
        expect(res.body.password).toBeUndefined();
      });
  });

  it('should get current user successfuly', async () => {
    const email = 'kaka@test.com';

    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send({ email, password: '123' });

    const cookie = res.get('Set-Cookie');

    return request(app.getHttpServer())
      .get('/users/current-user')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body.email).toBe(email);
      });
  });
});
