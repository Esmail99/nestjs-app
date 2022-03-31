import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', process.env.DB_NAME));
  } catch {}
});

global.afterEach(() => {
  const connection = getConnection();

  connection.close();
});
