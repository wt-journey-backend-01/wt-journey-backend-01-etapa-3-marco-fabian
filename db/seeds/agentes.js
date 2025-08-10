exports.seed = async function seed(knex) {
  await knex('casos').del();
  await knex('agentes').del();

  await knex('agentes').insert([
    {
      nome: 'João Silva',
      dataDeIncorporacao: '2015-03-10',
      cargo: 'inspetor',
    },
    {
      nome: 'Maria Oliveira',
      dataDeIncorporacao: '2018-07-22',
      cargo: 'delegado',
    },
  ]);
};


