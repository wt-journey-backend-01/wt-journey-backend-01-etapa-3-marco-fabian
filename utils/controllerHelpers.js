const { createNotFoundError, validateUUID, createValidationError } = require('./errorHandler');

function handleCreate(repository, validateFn, req, res, next) {
    try {
        const dados = req.body;
        const { id: _, ...dadosSemId } = dados;
        validateFn(dadosSemId);
        
        const novoItem = repository.create(dadosSemId);
        res.status(201).json(novoItem);
    } catch (error) {
        next(error);
    }
}

function handleUpdate(repository, validateFn, req, res, next) {
    try {
        const { id } = req.params;
        const dados = req.body;

        const existingItem = repository.findById(id);
        if (!existingItem) {
            throw createNotFoundError(getNotFoundMessage(repository.name));
        }
        
        const { id: _, ...dadosSemId } = dados;
        validateFn(dadosSemId, true);

        const itemAtualizado = repository.updateById(id, dadosSemId);
        res.status(200).json(itemAtualizado);
    } catch (error) {
        next(error);
    }
}

function handlePatch(repository, validateFn, req, res, next) {
    try {
        const { id } = req.params;
        const dados = req.body;

        const existingItem = repository.findById(id);
        if (!existingItem) {
            throw createNotFoundError(getNotFoundMessage(repository.name));
        }
        
        const { id: _, ...dadosSemId } = dados;
        if (Object.keys(dadosSemId).length > 0) {
            validateFn(dadosSemId);
        }

        const itemAtualizado = repository.patchById(id, dadosSemId);
        res.status(200).json(itemAtualizado);
    } catch (error) {
        next(error);
    }
}

function handleGetById(repository, entityName, req, res, next) {
    try {
        const { id } = req.params;

        const item = repository.findById(id);
        if (!item) {
            throw createNotFoundError(`${entityName} não encontrado`);
        }

        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
}

function handleDelete(repository, entityName, req, res, next) {
    try {
        const { id } = req.params;

        const deleted = repository.deleteById(id);
        if (!deleted) {
            throw createNotFoundError(`${entityName} não encontrado`);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

function getNotFoundMessage(repositoryName) {
    if (repositoryName && repositoryName.includes('agentes')) {
        return 'Agente não encontrado';
    }
    if (repositoryName && repositoryName.includes('casos')) {
        return 'Caso não encontrado';
    }
    return 'Recurso não encontrado';
}

module.exports = {
    handleCreate,
    handleUpdate,
    handlePatch,
    handleGetById,
    handleDelete
}; 