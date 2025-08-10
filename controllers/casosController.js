const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { createValidationError, createNotFoundError, validateCasoStatus } = require('../utils/errorHandler');
const { validateCasoData } = require('../utils/validators');
const { handleCreate, handleUpdate, handlePatch, handleGetById, handleDelete } = require('../utils/controllerHelpers');

async function getAllCasos(req, res, next) {
    try {
        const { agente_id, status, q } = req.query;
        let casos;

        if (agente_id !== undefined) {
            const parsed = Number(agente_id);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                throw createValidationError('Parâmetros inválidos', { agente_id: 'agente_id deve ser um inteiro positivo' });
            }
        }

        if (status) {
            const validStatusValues = ['aberto', 'solucionado'];
            if (!validStatusValues.includes(status.toLowerCase())) {
                throw createValidationError('Parâmetros inválidos', { 
                    status: "O campo 'status' deve ser 'aberto' ou 'solucionado'" 
                });
            }
        }

        const parsedId = agente_id !== undefined ? Number(agente_id) : undefined;
        casos = await casosRepository.findWithFilters({ agente_id: parsedId, status, q });

        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
}

function getCasoById(req, res, next) {
    const { id } = req.params;
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return next(createValidationError('Parâmetros inválidos', { id: 'id deve ser um inteiro positivo' }));
    }
    handleGetById(casosRepository, 'Caso', req, res, next);
}

async function getAgenteFromCaso(req, res, next) {
    try {
        const { caso_id } = req.params;
        const parsed = Number(caso_id);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw createValidationError('Parâmetros inválidos', { caso_id: 'caso_id deve ser um inteiro positivo' });
        }
        const caso = await casosRepository.findById(parsed);
        if (!caso) {
            throw createNotFoundError('Caso não encontrado');
        }
        const agente = await agentesRepository.findById(caso.agente_id);
        if (!agente) {
            throw createNotFoundError('Agente responsável não encontrado');
        }
        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
}

function createCaso(req, res, next) {
    const validateCreate = async (dados) => {
        if (dados.status) dados.status = String(dados.status).toLowerCase();
        await validateCasoData(dados, agentesRepository, false);
    };
    handleCreate(casosRepository, validateCreate, req, res, next);
}

function updateCaso(req, res, next) {
    const { id } = req.params;
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return next(createValidationError('Parâmetros inválidos', { id: 'id deve ser um inteiro positivo' }));
    }
    const validateWithAgentes = async (dados, isUpdate) => {
        if (dados.status) dados.status = String(dados.status).toLowerCase();
        await validateCasoData(dados, agentesRepository, isUpdate);
    };
    handleUpdate(casosRepository, validateWithAgentes, req, res, next);
}

function patchCaso(req, res, next) {
    const { id } = req.params;
    const parsedPathId = Number(id);
    if (!Number.isInteger(parsedPathId) || parsedPathId <= 0) {
        return next(createValidationError('Parâmetros inválidos', { id: 'id deve ser um inteiro positivo' }));
    }
    const validatePatch = async (dados) => {
        const errors = {};
        if (dados.status) {
            dados.status = String(dados.status).toLowerCase();
            const statusError = validateCasoStatus(dados.status);
            if (statusError) {
                errors.status = statusError;
            }
        }
        if (dados.agente_id !== undefined) {
            const parsed = Number(dados.agente_id);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                errors.agente_id = 'agente_id deve ser um inteiro positivo';
            } else {
                const agente = await agentesRepository.findById(parsed);
                if (!agente) {
                    throw createNotFoundError('Agente não encontrado');
                }
            }
        }
        if (Object.keys(errors).length > 0) {
            throw createValidationError('Parâmetros inválidos', errors);
        }
    };
    handlePatch(casosRepository, validatePatch, req, res, next);
}

function deleteCaso(req, res, next) {
    const { id } = req.params;
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return next(createValidationError('Parâmetros inválidos', { id: 'id deve ser um inteiro positivo' }));
    }
    handleDelete(casosRepository, 'Caso', req, res, next);
}

module.exports = {
    getAllCasos,
    getCasoById,
    getAgenteFromCaso,
    createCaso,
    updateCaso,
    patchCaso,
    deleteCaso
}; 