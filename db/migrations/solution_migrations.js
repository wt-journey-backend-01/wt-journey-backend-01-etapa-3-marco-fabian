exports.up = async function up(knex) {
  await knex.schema.createTable('agentes', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.date('dataDeIncorporacao').notNullable();
    table.string('cargo').notNullable();
  });
  await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descricao').notNullable();
    table.enu('status', ['aberto', 'solucionado'], {
      useNative: true,
      enumName: 'caso_status_enum',
    }).notNullable();
    table
      .integer('agente_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agentes')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
  });
};
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('casos');
  await knex.schema.dropTableIfExists('agentes');
  try {
    await knex.raw("DROP TYPE IF EXISTS caso_status_enum");
  } catch (_) {
  }
};


