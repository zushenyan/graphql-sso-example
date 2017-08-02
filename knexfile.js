// Update with your config settings.
// 
module.exports = {
  test: {
    client: 'pg',
    connection: {
      database: 'graphqlsso_test'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    },
    pool: {
      min: 0,
      max: 10
    }
  },

  development: {
    client: 'pg',
    connection: {
      database: 'graphqlsso_development'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    },
    pool: {
      min: 0,
      max: 10
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    },
    pool: {
      min: 0,
      max: 10
    }
  }

};
