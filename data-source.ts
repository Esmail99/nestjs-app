import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'development-db.sqlite',
  entities: ['**/*.entity.js'],
  migrations: ['migration/'],
  subscribers: [],
});
