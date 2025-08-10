const db = require('../db/db');

async function findAll() {
  return db('casos').select('*');
}

async function findById(id) {
  return db('casos').where({ id }).first();
}

async function create(caso) {
  const rows = await db('casos').insert(caso).returning('*');
  return rows[0];
}

async function updateById(id, dadosAtualizados) {
  const rows = await db('casos').where({ id }).update(dadosAtualizados).returning('*');
  return rows[0] || null;
}

async function patchById(id, dadosAtualizados) {
  const rows = await db('casos').where({ id }).update(dadosAtualizados).returning('*');
  return rows[0] || null;
}

async function deleteById(id) {
  const deleted = await db('casos').where({ id }).del();
  return deleted > 0;
}

async function findByAgenteId(agente_id) {
  return db('casos').where({ agente_id });
}

async function findByStatus(status) {
  return db('casos').where({ status: String(status).toLowerCase() });
}

async function search(query) {
  const like = `%${query}%`;
  return db('casos')
    .whereILike('titulo', like)
    .orWhereILike('descricao', like);
}

function queryBase() {
  return db('casos');
}

async function findWithFilters({ agente_id, status, q }) {
  let query = queryBase();
  if (agente_id) {
    query = query.where('agente_id', agente_id);
  }
  if (status) {
    query = query.where({ status: String(status).toLowerCase() });
  }
  if (q) {
    const like = `%${q}%`;
    query = query.andWhere(function () {
      this.whereILike('titulo', like).orWhereILike('descricao', like);
    });
  }
  return query.select('*');
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  patchById,
  deleteById,
  findByAgenteId,
  findByStatus,
  search,
  queryBase,
  findWithFilters,
};