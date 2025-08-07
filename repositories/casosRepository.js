const { v4: uuidv4 } = require('uuid');

const casos = [];

function findAll() {
    return casos;
}

function findById(id) {
    return casos.find(caso => caso.id === id);
}

function create(caso) {
    const novoCaso = {
        id: uuidv4(),
        ...caso
    };
    casos.push(novoCaso);
    return novoCaso;
}

function updateById(id, dadosAtualizados) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index === -1) return null;
    
    casos[index] = { id, ...dadosAtualizados };
    return casos[index];
}

function patchById(id, dadosAtualizados) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index === -1) return null;
    
    const { id: _, ...dadosSemId } = dadosAtualizados;
    casos[index] = { ...casos[index], ...dadosSemId };
    return casos[index];
}

function deleteById(id) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index === -1) return false;
    
    casos.splice(index, 1);
    return true;
}

function findByAgenteId(agente_id) {
    return casos.filter(caso => caso.agente_id === agente_id);
}

function findByStatus(status) {
    return casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
}

function search(query) {
    const queryLower = query.toLowerCase();
    return casos.filter(caso => 
        caso.titulo.toLowerCase().includes(queryLower) || 
        caso.descricao.toLowerCase().includes(queryLower)
    );
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
    search
}; 