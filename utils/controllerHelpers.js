const { createNotFoundError, createValidationError } = require('./errorHandler');

async function handleCreate(repository, validateFn, req, res, next) {
  try {
    const dados = req.body;
    const { id: _, ...dadosSemId } = dados;
    await Promise.resolve(validateFn(dadosSemId));
    const novoItem = await repository.create(dadosSemId);
    res.status(201).json(novoItem);
  } catch (error) {
    next(error);
  }
}

async function handleUpdate(repository, validateFn, req, res, next) {
  try {
    const { id } = req.params;
    const dados = req.body;
    if (Object.prototype.hasOwnProperty.call(dados, 'id')) {
      throw createValidationError('Campo proibido', { id: 'Não é permitido alterar o campo id' });
    }
    const existingItem = await repository.findById(id);
    if (!existingItem) {
      throw createNotFoundError(getNotFoundMessage(repository.name));
    }
    const { id: _, ...dadosSemId } = dados;
    await Promise.resolve(validateFn(dadosSemId, true));
    const itemAtualizado = await repository.updateById(id, dadosSemId);
    res.status(200).json(itemAtualizado);
  } catch (error) {
    next(error);
  }
}

async function handlePatch(repository, validateFn, req, res, next) {
  try {
    const { id } = req.params;
    const dados = req.body;
    if (Object.prototype.hasOwnProperty.call(dados, 'id')) {
      throw createValidationError('Campo proibido', { id: 'Não é permitido alterar o campo id' });
    }
    const existingItem = await repository.findById(id);
    if (!existingItem) {
      throw createNotFoundError(getNotFoundMessage(repository.name));
    }
    const { id: _, ...dadosSemId } = dados;
    if (Object.keys(dadosSemId).length > 0) {
      await Promise.resolve(validateFn(dadosSemId));
    }
    const itemAtualizado = await repository.patchById(id, dadosSemId);
    res.status(200).json(itemAtualizado);
  } catch (error) {
    next(error);
  }
}

async function handleGetById(repository, entityName, req, res, next) {
  try {
    const { id } = req.params;
    const item = await repository.findById(id);
    if (!item) {
      throw createNotFoundError(`${entityName} não encontrado`);
    }
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
}

async function handleDelete(repository, entityName, req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await repository.deleteById(id);
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