const express = require('express');
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const { errorHandler } = require('./utils/errorHandler');
const { swaggerUi, specs } = require('./docs/swagger');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/docs`);
});