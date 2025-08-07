const agentesRepository = require('../repositories/agentesRepository');
const { createValidationError, validateDateFormat } = require('../utils/errorHandler');
const { validateAgenteData } = require('../utils/validators');
const { handleCreate, handleUpdate, handlePatch, handleGetById, handleDelete } = require('../utils/controllerHelpers');

function getAllAgentes(req, res, next) {
    try {
        const { cargo, sort } = req.query;
        let agentes;

        if (cargo) {
            const validCargos = ['inspetor', 'delegado'];
            if (!validCargos.includes(cargo.toLowerCase())) {
                throw createValidationError('Parâmetros inválidos', { 
                    cargo: "O campo 'cargo' deve ser 'inspetor' ou 'delegado'" 
                });
            }
        }

        if (sort) {
            const validSortFields = ['dataDeIncorporacao', '-dataDeIncorporacao'];
            if (!validSortFields.includes(sort)) {
                throw createValidationError('Parâmetros inválidos', { 
                    sort: "O campo 'sort' deve ser 'dataDeIncorporacao' ou '-dataDeIncorporacao'" 
                });
            }
        }

        if (cargo && sort) {
            agentes = agentesRepository.findByCargo(cargo);
            const order = sort.startsWith('-') ? 'desc' : 'asc';
            agentes = agentes.sort((a, b) => {
                const dateA = new Date(a.dataDeIncorporacao);
                const dateB = new Date(b.dataDeIncorporacao);
                return order === 'desc' ? dateB - dateA : dateA - dateB;
            });
        } else if (cargo) {
            agentes = agentesRepository.findByCargo(cargo);
        } else if (sort) {
            const order = sort.startsWith('-') ? 'desc' : 'asc';
            agentes = agentesRepository.findAllSorted(order);
        } else {
            agentes = agentesRepository.findAll();
        }

        res.status(200).json(agentes);
    } catch (error) {
        next(error);
    }
}

function getAgenteById(req, res, next) {
    handleGetById(agentesRepository, 'Agente', req, res, next);
}

function createAgente(req, res, next) {
    const validateCreate = (dados) => {
        validateAgenteData(dados, false);
    };
    
    handleCreate(agentesRepository, validateCreate, req, res, next);
}

function updateAgente(req, res, next) {
    handleUpdate(agentesRepository, validateAgenteData, req, res, next);
}

function patchAgente(req, res, next) {
    const validatePatch = (dados) => {
        const errors = {};
        
        if (dados.dataDeIncorporacao) {
            const dateError = validateDateFormat(dados.dataDeIncorporacao, 'dataDeIncorporacao');
            if (dateError) {
                errors.dataDeIncorporacao = dateError;
            } else {
                const data = new Date(dados.dataDeIncorporacao);
                const hoje = new Date();
                const dataStr = data.toISOString().split('T')[0];
                const hojeStr = hoje.toISOString().split('T')[0];
                if (dataStr > hojeStr) {
                    errors.dataDeIncorporacao = 'A data de incorporação não pode ser no futuro';
                }
            }
        }
        
        const validCargos = ['inspetor', 'delegado'];
        if (dados.cargo && !validCargos.includes(dados.cargo.toLowerCase())) {
            errors.cargo = "O campo 'cargo' deve ser 'inspetor' ou 'delegado'";
        }
        
        if (Object.keys(errors).length > 0) {
            throw createValidationError('Parâmetros inválidos', errors);
        }
    };
    handlePatch(agentesRepository, validatePatch, req, res, next);
}

function deleteAgente(req, res, next) {
    handleDelete(agentesRepository, 'Agente', req, res, next);
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    patchAgente,
    deleteAgente
}; 