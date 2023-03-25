const dbConfig = {
  synchronize: false,
  migrations: ['migrations/*js'],
  cli: {
    // entitiesDir: 'src/*.entity.js',
    migrationsDir: 'migration',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'development-db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;

  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test-db.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;

  case 'test':
    break;

  default:
    throw new Error('Uknown node environment');
}

console.log('kaka', dbConfig);

module.exports = dbConfig;

export const AppDataSource = new DataSource(dbConfig);
