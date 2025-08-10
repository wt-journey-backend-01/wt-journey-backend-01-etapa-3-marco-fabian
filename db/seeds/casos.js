exports.seed = async function seed(knex) {
  const agentes = await knex('agentes').select('id').orderBy('id');
  if (agentes.length < 2) {
    throw new Error('Seeds de agentes devem ser executadas antes dos casos.');
  }

  const [agente1, agente2] = agentes;

  await knex('casos').insert([
    {
      titulo: 'Roubo na Avenida Central',
      descricao: 'Investigação de roubo a mão armada em estabelecimento comercial.',
      status: 'aberto',
      agente_id: agente1.id,
    },
    {
      titulo: 'Vazamento de Dados',
      descricao: 'Possível vazamento de dados sensíveis de órgão público.',
      status: 'solucionado',
      agente_id: agente2.id,
    },
  ]);
};


