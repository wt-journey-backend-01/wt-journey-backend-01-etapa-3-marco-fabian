const db = require('../db/db');

async function findAll() {
  return db('agentes').select('*');
}

async function findById(id) {
  return db('agentes').where({ id }).first();
}

async function create(agente) {
  const rows = await db('agentes').insert(agente).returning('*');
  return rows[0];
}

async function updateById(id, dadosAtualizados) {
  const rows = await db('agentes').where({ id }).update(dadosAtualizados).returning('*');
  return rows[0] || null;
}

async function patchById(id, dadosAtualizados) {
  const rows = await db('agentes').where({ id }).update(dadosAtualizados).returning('*');
  return rows[0] || null;
}

async function deleteById(id) {
  const deleted = await db('agentes').where({ id }).del();
  return deleted > 0;
}

async function findByCargo(cargo) {
  return db('agentes').whereRaw('LOWER(cargo) = LOWER(?)', [cargo]);
}

async function findAllSorted(order = 'asc') {
  const direction = order === 'desc' ? 'desc' : 'asc';
  return db('agentes').select('*').orderBy('dataDeIncorporacao', direction);
}

async function findByCargoSorted(cargo, order = 'asc') {
  const direction = order === 'desc' ? 'desc' : 'asc';
  return db('agentes')
    .whereRaw('LOWER(cargo) = LOWER(?)', [cargo])
    .orderBy('dataDeIncorporacao', direction);
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  patchById,
  deleteById,
  findByCargo,
  findAllSorted,
  findByCargoSorted,
};