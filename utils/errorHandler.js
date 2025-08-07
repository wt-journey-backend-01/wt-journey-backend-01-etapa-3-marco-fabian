class APIError extends Error {
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.isOperational) {
        const response = {
            status: err.statusCode,
            message: err.message
        };

        if (err.errors) {
            response.errors = err.errors;
        }

        return res.status(err.statusCode).json(response);
    }

    res.status(500).json({
        status: 500,
        message: 'Erro interno do servidor'
    });
}

function createValidationError(message, errors) {
    return new APIError(message, 400, errors);
}

function createNotFoundError(message = 'Recurso não encontrado') {
    return new APIError(message, 404);
}

function validateRequiredFields(data, requiredFields) {
    const errors = {};
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].toString().trim() === '') {
            errors[field] = `O campo '${field}' é obrigatório`;
        }
    });

    return Object.keys(errors).length > 0 ? errors : null;
}

function validateCasoStatus(status) {
    const validStatuses = ['aberto', 'solucionado'];
    if (!validStatuses.includes(status.toLowerCase())) {
        return "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
    }
    return null;
}

function validateDateFormat(date, fieldName = 'data') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return `Campo ${fieldName} deve seguir a formatação 'YYYY-MM-DD'`;
    }
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return `Campo ${fieldName} deve ser uma data válida`;
    }
    
    return null;
}

function validateUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

module.exports = {
    APIError,
    errorHandler,
    createValidationError,
    createNotFoundError,
    validateRequiredFields,
    validateCasoStatus,
    validateDateFormat,
    validateUUID
}; 