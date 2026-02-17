# 🚀 Guia de Setup - SoftFit Backend

Este guia vai te ajudar a configurar e executar o projeto do zero.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ Docker e Docker Compose ([Download](https://www.docker.com/))
- ✅ Git
- ✅ Conta Anthropic com API Key ([Criar conta](https://console.anthropic.com/))

## 🎯 Passo a Passo

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd softfit-backend
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (copie do `.env.example`):

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database (use as mesmas do docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=softfit
DB_PASSWORD=softfit123
DB_DATABASE=softfit_db
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT (IMPORTANTE: Trocar em produção!)
JWT_SECRET=seu-secret-super-seguro-aqui-com-no-minimo-32-caracteres
JWT_EXPIRES_IN=7d

# Anthropic Claude API (OBRIGATÓRIO)
ANTHROPIC_API_KEY=sk-ant-api03-sua-key-aqui

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3001
```

**⚠️ IMPORTANTE**: Você DEVE configurar a `ANTHROPIC_API_KEY` para que o processamento de imagens funcione!

### 4. Suba o Banco de Dados (PostgreSQL)

```bash
docker-compose up -d
```

Isso vai iniciar:
- PostgreSQL na porta 5432
- pgAdmin na porta 5050 (opcional - interface web)

Verifique se está rodando:

```bash
docker ps
```

Você deve ver os containers `softfit-postgres` e `softfit-pgadmin` rodando.

### 5. Crie as Tabelas do Banco (Migrations)

```bash
# Primeiro, gere a migration inicial
npm run migration:generate -- src/infrastructure/database/migrations/InitialSchema

# Depois, execute a migration
npm run migration:run
```

### 6. Inicie a Aplicação

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev
```

Você deve ver no terminal:

```
🚀 Application is running on: http://localhost:3000/api/v1
📚 Swagger documentation: http://localhost:3000/api/v1/docs
🌍 Environment: development
```

### 7. Teste a API

Abra seu navegador em:

- **API**: http://localhost:3000/api/v1
- **Documentação Swagger**: http://localhost:3000/api/v1/docs

Ou use curl/Postman para testar o endpoint de registro:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "role": "client"
  }'
```

Você deve receber uma resposta com o token JWT:

```json
{
  "userId": "uuid-aqui",
  "email": "joao@email.com",
  "name": "João Silva",
  "role": "client",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🎉 Pronto!

Seu backend está rodando! Agora você pode:

1. ✅ Registrar usuários
2. ✅ Fazer login
3. ✅ Ver a documentação interativa no Swagger

## 📊 Acessar o Banco de Dados

### Via pgAdmin (Interface Web)

1. Acesse http://localhost:5050
2. Login:
   - Email: `admin@softfit.com`
   - Senha: `admin123`
3. Adicione um novo servidor:
   - Host: `postgres` (nome do container)
   - Port: `5432`
   - Username: `softfit`
   - Password: `softfit123`
   - Database: `softfit_db`

### Via CLI (psql)

```bash
docker exec -it softfit-postgres psql -U softfit -d softfit_db
```

Comandos úteis:
```sql
-- Listar tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Listar usuários cadastrados
SELECT * FROM users;
```

## 🧪 Rodando Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução**: 
```bash
# Parar containers
docker-compose down

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Subir novamente
docker-compose up -d

# Aguardar ~10 segundos
sleep 10

# Rodar migrations
npm run migration:run
```

### Erro: "ANTHROPIC_API_KEY not found"

**Solução**: Verifique se você configurou a key no arquivo `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-sua-key-aqui
```

### Erro: "Port 3000 already in use"

**Solução**: Altere a porta no `.env`:
```env
PORT=3001
```

### Erro ao fazer migration

**Solução**:
```bash
# Ver status das migrations
npm run typeorm migration:show

# Reverter última migration
npm run migration:revert

# Tentar novamente
npm run migration:run
```

## 🔍 Próximos Passos

Agora que o básico está funcionando, você pode:

1. **Implementar upload de fotos de refeições**
   - Ver `/src/infrastructure/services/ai/claude-ai.service.ts`
   - Criar endpoint POST `/meals/photo`

2. **Adicionar gestão de perfil de usuário**
   - Implementar UserProfile entity
   - Criar endpoints de perfil

3. **Implementar cálculo de metas nutricionais**
   - Ver `/src/infrastructure/services/nutrition/nutrition-calculator.service.ts`

4. **Adicionar autenticação JWT nos endpoints**
   - Criar Guards
   - Proteger rotas

## 📚 Recursos Úteis

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação TypeORM](https://typeorm.io)
- [Documentação Claude API](https://docs.anthropic.com)
- [CONTEXT.md](./CONTEXT.md) - Entenda a arquitetura do projeto
- [README.md](./README.md) - Documentação completa

## 💡 Dicas

- Use o Swagger para testar endpoints interativamente
- Rode `npm run start:dev` para development com hot-reload
- Sempre leia o CONTEXT.md antes de fazer mudanças
- Use Docker para o banco (não instale PostgreSQL local)
- Mantenha o `.env` no `.gitignore` (nunca commite senhas!)

---

**Precisa de ajuda?** Verifique os logs da aplicação ou do Docker:

```bash
# Logs da aplicação NestJS
# (aparecem no terminal onde você rodou npm run start:dev)

# Logs do PostgreSQL
docker logs softfit-postgres

# Logs do pgAdmin
docker logs softfit-pgadmin
```
