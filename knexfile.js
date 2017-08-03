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
      database: 'postgres://spqmbfgqkkjntk:5c856a5fe0275dd61a6a05b1b04977b8654736ebcc1437e14c9e6feb74e3438e@ec2-107-22-160-199.compute-1.amazonaws.com:5432/d2f5qvlqbh8dpb',
      ssl: true
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
