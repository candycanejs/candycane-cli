import providers from './providers';

const config = {
  providers,

  database: {
    client: 'sqlite3',
    connection: {
      filename: `${process.cwd()}/dev.sqlite`
    },
  }
};

if (process.env.DATABASE_URL) {
  config.database.client = `postgresql`;
  config.database.connection = process.env.DATABASE_URL;
}

export default config;
