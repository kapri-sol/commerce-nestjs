import { DataSource, MixedList } from 'typeorm';

type TestDatasourceOption = {
  entities: MixedList<Function>;
  logging?: boolean;
};

export const getTestDatasource = (options: TestDatasourceOption) => {
  return new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'test',
    username: 'root',
    password: '1234',
    entities: options.entities,
    synchronize: true,
    dropSchema: true,
    logging: options.logging || false,
  });
};
