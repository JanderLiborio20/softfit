# ⚡ Quick Start - SoftFit Backend

## Setup Rápido (5 minutos)

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Editar .env e adicionar sua ANTHROPIC_API_KEY
# ANTHROPIC_API_KEY=sk-ant-api03-sua-key-aqui

# 4. Subir banco de dados
docker-compose up -d

# 5. Criar tabelas
npm run migration:run

# 6. Iniciar servidor
npm run start:dev
```

## ✅ Pronto!

- API: http://localhost:3000/api/v1
- Docs: http://localhost:3000/api/v1/docs
- pgAdmin: http://localhost:5050

## 🧪 Testar

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@email.com",
    "password": "senha123",
    "role": "client"
  }'
```

## 📖 Mais Detalhes

- Setup completo: [SETUP.md](./SETUP.md)
- Arquitetura: [CONTEXT.md](./CONTEXT.md)
- Documentação: [README.md](./README.md)

## 🚀 Desenvolvimento

```bash
# Development
npm run start:dev

# Build
npm run build

# Tests
npm test

# Lint
npm run lint

# Migrations
npm run migration:generate -- src/infrastructure/database/migrations/NomeMigration
npm run migration:run
```

## 🐛 Problemas?

```bash
# Resetar banco
docker-compose down -v
docker-compose up -d
npm run migration:run

# Ver logs
docker logs softfit-postgres
```

**Precisa de ajuda?** Leia o [SETUP.md](./SETUP.md) completo.
