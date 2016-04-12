// Update with your config settings.

var config = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'blog-test',
      user:     process.env.USER,
      password: '',
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
  },
};

if (process.env.DATABASE_URL) {
  config.development.connection = process.env.DATABASE_URL;
}

module.exports = config;
