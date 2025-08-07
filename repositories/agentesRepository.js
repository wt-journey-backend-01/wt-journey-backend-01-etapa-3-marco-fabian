const { v4: uuidv4 } = require('uuid');

const agentes = [];

function findAll() {
    return agentes;
}

function findById(id) {
    return agentes.find(agente => agente.id === id);
}

function create(agente) {
    const novoAgente = {
        id: uuidv4(),
        ...agente
    };
    agentes.push(novoAgente);
    return novoAgente;
}

function updateById(id, dadosAtualizados) {
    const index = agentes.findIndex(agente => agente.id === id);
    if (index === -1) return null;
    
    agentes[index] = { id, ...dadosAtualizados };
    return agentes[index];
}

function patchById(id, dadosAtualizados) {
    const index = agentes.findIndex(agente => agente.id === id);
    if (index === -1) return null;
    
    const { id: _, ...dadosSemId } = dadosAtualizados;
    agentes[index] = { ...agentes[index], ...dadosSemId };
    return agentes[index];
}

function deleteById(id) {
    const index = agentes.findIndex(agente => agente.id === id);
    if (index === -1) return false;
    
    agentes.splice(index, 1);
    return true;
}

function findByCargo(cargo) {
    return agentes.filter(agente => agente.cargo.toLowerCase() === cargo.toLowerCase());
}

function findAllSorted(order = 'asc') {
    const agentesCopy = [...agentes];
    return agentesCopy.sort((a, b) => {
        const dateA = new Date(a.dataDeIncorporacao);
        const dateB = new Date(b.dataDeIncorporacao);
        
        if (order === 'desc') {
            return dateB - dateA;
        }
        return dateA - dateB;
    });
}

module.exports = {
    findAll,
    findById,
    create,
    updateById,
    patchById,
    deleteById,
    findByCargo,
    findAllSorted
}; 