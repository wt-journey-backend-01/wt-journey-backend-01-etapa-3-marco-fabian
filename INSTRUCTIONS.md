# Instruções de Execução

1) Banco de Dados (Docker)
- Crie `.env` na raiz com:
  - POSTGRES_USER=postgres
  - POSTGRES_PASSWORD=postgres
  - POSTGRES_DB=policia_db
  - NODE_ENV=development
- Suba: `docker compose up -d`

2) Dependências
- `npm install`

3) Migrations
- `npx knex migrate:latest`

4) Seeds
- `npx knex seed:run`

5) API
- `npm run start`
- Swagger: http://localhost:3000/docs

Observações
- IDs são inteiros autogerados pelo PostgreSQL.
- Não envie `id` no corpo em criação/atualização.
