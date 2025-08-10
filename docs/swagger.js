const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do Departamento de Polícia',
            version: '1.0.0',
            description: 'API REST para gerenciamento de casos e agentes policiais',
            contact: {
                name: 'Marco Fabian',
                email: 'marco.fabian@policia.gov.br'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ],
        components: {
            schemas: {
                Agente: {
                    type: 'object',
                    required: ['nome', 'dataDeIncorporacao', 'cargo'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID do agente (gerado automaticamente)'
                        },
                        nome: {
                            type: 'string',
                            description: 'Nome completo do agente'
                        },
                        dataDeIncorporacao: {
                            type: 'string',
                            format: 'date',
                            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                            description: 'Data de incorporação no formato YYYY-MM-DD'
                        },
                        cargo: {
                            type: 'string',
                            enum: ['inspetor', 'delegado'],
                            description: 'Cargo do agente'
                        }
                    }
                },
                Caso: {
                    type: 'object',
                    required: ['titulo', 'descricao', 'status', 'agente_id'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID do caso (gerado automaticamente)'
                        },
                        titulo: {
                            type: 'string',
                            description: 'Título do caso'
                        },
                        descricao: {
                            type: 'string',
                            description: 'Descrição detalhada do caso'
                        },
                        status: {
                            type: 'string',
                            enum: ['aberto', 'solucionado'],
                            description: 'Status do caso'
                        },
                        agente_id: {
                            type: 'integer',
                            description: 'ID do agente responsável'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'integer',
                            description: 'Código de status HTTP'
                        },
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        },
                        errors: {
                            type: 'object',
                            description: 'Detalhes específicos dos erros'
                        }
                    }
                }
            }
        },
        paths: {
            '/agentes/{id}/casos': {
                get: {
                    summary: 'Lista os casos atribuídos a um agente',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'ID do agente'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de casos',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Caso' }
                                    }
                                }
                            }
                        },
                        400: { $ref: '#/components/schemas/Error' },
                        404: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            '/casos/{caso_id}/agente': {
                get: {
                    summary: 'Retorna o agente responsável por um caso',
                    parameters: [
                        {
                            name: 'caso_id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'ID do caso'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Agente responsável',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Agente' }
                                }
                            }
                        },
                        400: { $ref: '#/components/schemas/Error' },
                        404: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
}; 