module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'employee_app',
      user:     'employee_app',
      password: 'employee_app_password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
