const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { createValidationError, createNotFoundError, validateUUID, validateCasoStatus } = require('../utils/errorHandler');
const { validateCasoData } = require('../utils/validators');
const { handleCreate, handleUpdate, handlePatch, handleGetById, handleDelete } = require('../utils/controllerHelpers');

function getAllCasos(req, res, next) {
    try {
        const { agente_id, status, q } = req.query;
        let casos;

        if (agente_id) {
            if (!validateUUID(agente_id)) {
                throw createValidationError('Parâmetros inválidos', { agente_id: 'agente_id deve ser um UUID válido' });
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

        if (agente_id && status && q) {
            casos = casosRepository.findByAgenteId(agente_id);
            casos = casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
            casos = casos.filter(caso => 
                caso.titulo.toLowerCase().includes(q.toLowerCase()) || 
                caso.descricao.toLowerCase().includes(q.toLowerCase())
            );
        } else if (agente_id && status) {
            casos = casosRepository.findByAgenteId(agente_id);
            casos = casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
        } else if (agente_id && q) {
            casos = casosRepository.findByAgenteId(agente_id);
            casos = casos.filter(caso => 
                caso.titulo.toLowerCase().includes(q.toLowerCase()) || 
                caso.descricao.toLowerCase().includes(q.toLowerCase())
            );
        } else if (status && q) {
            casos = casosRepository.findByStatus(status);
            casos = casos.filter(caso => 
                caso.titulo.toLowerCase().includes(q.toLowerCase()) || 
                caso.descricao.toLowerCase().includes(q.toLowerCase())
            );
        } else if (agente_id) {
            casos = casosRepository.findByAgenteId(agente_id);
        } else if (status) {
            casos = casosRepository.findByStatus(status);
        } else if (q) {
            casos = casosRepository.search(q);
        } else {
            casos = casosRepository.findAll();
        }

        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
}

function getCasoById(req, res, next) {
    handleGetById(casosRepository, 'Caso', req, res, next);
}

function getAgenteFromCaso(req, res, next) {
    try {
        const { caso_id } = req.params;

        if (!validateUUID(caso_id)) {
            throw createValidationError('Parâmetros inválidos', { caso_id: 'caso_id deve ser um UUID válido' });
        }

        const caso = casosRepository.findById(caso_id);
        if (!caso) {
            throw createNotFoundError('Caso não encontrado');
        }

        const agente = agentesRepository.findById(caso.agente_id);
        if (!agente) {
            throw createNotFoundError('Agente responsável não encontrado');
        }

        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
}

function createCaso(req, res, next) {
    const validateCreate = (dados) => {
        validateCasoData(dados, agentesRepository, false);
    };
    
    handleCreate(casosRepository, validateCreate, req, res, next);
}

function updateCaso(req, res, next) {
    const validateWithAgentes = (dados, isUpdate) => {
        validateCasoData(dados, agentesRepository, isUpdate);
    };
    
    handleUpdate(casosRepository, validateWithAgentes, req, res, next);
}

function patchCaso(req, res, next) {
    const validatePatch = (dados) => {
        // Para PATCH, só validar campos que estão presentes
        const errors = {};
        
        if (dados.status) {
            const statusError = validateCasoStatus(dados.status);
            if (statusError) {
                errors.status = statusError;
            }
        }
        
        if (dados.agente_id) {
            if (!validateUUID(dados.agente_id)) {
                errors.agente_id = 'agente_id deve ser um UUID válido';
            } else {
                const agente = agentesRepository.findById(dados.agente_id);
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