// Update with your config settings.

var config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite'
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
  },
};

module.exports = config;
