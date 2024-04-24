/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Department', table => {
          table.integer('id').unique()
          table.string('name');
          table.timestamps(true, true);
    })
        .createTable('Salary', table => {
          table.integer('id').unique()
          table.float('amount');
          table.date('date');
          table.integer('employee_id')
          table.timestamps(true, true);
        })
        .createTable('Donation', table => {
          table.integer('id').unique()
          table.date('date');
          table.float('amount');
          table.string('currency');
          table.integer('employee_id')
          table.timestamps(true, true);
        })
        .createTable('Rate', table => {
          table.increments('id')
          table.date('date');
          table.float('value');
          table.string('sign');
          table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Department')
      .dropTable('Salary')
      .dropTable('Donation')
      .dropTable('Rate')
};
