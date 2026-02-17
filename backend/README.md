# SoftFit Backend API

Backend da aplicação SoftFit - Plataforma de gerenciamento nutricional e treinos com IA.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Migrations](#migrations)
- [Deploy](#deploy)

## 🎯 Sobre o Projeto

SoftFit é uma aplicação que permite aos usuários registrarem suas refeições através de fotos e áudio, utilizando IA (Claude) para identificar alimentos e calcular macronutrientes automaticamente. Também oferece gestão de treinos e conexão com nutricionistas profissionais.

### Principais Funcionalidades

- ✅ Autenticação JWT (Clientes e Nutricionistas)
- 📸 Upload e processamento de fotos de refeições via IA
- 🎤 Processamento de áudio para registro de refeições
- 📊 Cálculo automático de calorias e macros
- 🏋️ Gestão de fichas de treino
- 👨‍⚕️ Vinculação Nutricionista-Cliente
- 📈 Dashboard e relatórios de evolução

## 🏗️ Arquitetura

Este projeto utiliza **Clean Architecture (Hexagonal)** para garantir:
- ✅ Independência de frameworks
- ✅ Testabilidade
- ✅ Independência de UI/Database
- ✅ Manutenibilidade e escalabilidade

### Camadas da Arquitetura

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Controllers, DTOs, Guards)          │
├─────────────────────────────────────────┤
│         Application Layer               │
│    (Use Cases, Ports/Interfaces)        │
├─────────────────────────────────────────┤
│           Domain Layer                  │
│    (Entities, Value Objects, Events)    │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (Repositories, External Services, DB)  │
└─────────────────────────────────────────┘
```

**Princípios aplicados:**
- **Dependency Rule**: Dependências apontam sempre para dentro (Domain)
- **Ports & Adapters**: Interfaces (ports) definem contratos, implementações (adapters) são injetadas
- **Single Responsibility**: Cada módulo tem uma única responsabilidade
- **Open/Closed**: Aberto para extensão, fechado para modificação

## 🚀 Tecnologias

- **Framework**: NestJS 10
- **Linguagem**: TypeScript 5
- **Banco de Dados**: PostgreSQL 15+
- **ORM**: TypeORM 0.3
- **Autenticação**: JWT + Passport
- **IA**: Anthropic Claude API (Vision + Text)
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest
- **Upload**: Multer + Sharp (otimização de imagens)

## 📦 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn
- Conta Anthropic (API Key para Claude)

## ⚙️ Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd softfit-backend

# Instale as dependências
npm install
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=softfit
DB_PASSWORD=softfit123
DB_DATABASE=softfit_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# URLs
FRONTEND_URL=http://localhost:3001
```

### 2. Configurar Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb softfit_db

# Ou via psql
psql -U postgres
CREATE DATABASE softfit_db;
CREATE USER softfit WITH PASSWORD 'softfit123';
GRANT ALL PRIVILEGES ON DATABASE softfit_db TO softfit;
```

### 3. Executar Migrations

```bash
npm run migration:run
```

## 🏃 Executando o Projeto

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Modo de produção
npm run build
npm run start:prod

# Debug
npm run start:debug
```

A API estará disponível em: `http://localhost:3000`

Documentação Swagger: `http://localhost:3000/api/docs`

## 📁 Estrutura de Pastas

```
src/
├── domain/                          # Camada de Domínio (Regras de Negócio)
│   ├── entities/                    # Entidades do domínio
│   │   ├── user.entity.ts
│   │   ├── meal.entity.ts
│   │   ├── workout.entity.ts
│   │   └── nutritionist.entity.ts
│   ├── value-objects/               # Objetos de Valor
│   │   ├── email.vo.ts
│   │   ├── password.vo.ts
│   │   └── macros.vo.ts
│   ├── enums/                       # Enumerações do domínio
│   │   ├── user-goal.enum.ts
│   │   ├── activity-level.enum.ts
│   │   └── gender.enum.ts
│   └── exceptions/                  # Exceções de domínio
│       ├── domain.exception.ts
│       └── business-rule.exception.ts
│
├── application/                     # Camada de Aplicação (Casos de Uso)
│   ├── use-cases/                   # Casos de uso
│   │   ├── auth/
│   │   │   ├── register-user.usecase.ts
│   │   │   ├── login.usecase.ts
│   │   │   └── refresh-token.usecase.ts
│   │   ├── meals/
│   │   │   ├── create-meal-from-photo.usecase.ts
│   │   │   ├── create-meal-from-audio.usecase.ts
│   │   │   ├── list-meals.usecase.ts
│   │   │   └── update-meal.usecase.ts
│   │   ├── users/
│   │   │   ├── get-user-profile.usecase.ts
│   │   │   ├── update-user-profile.usecase.ts
│   │   │   └── calculate-goals.usecase.ts
│   │   └── workouts/
│   │       ├── create-workout.usecase.ts
│   │       └── list-workouts.usecase.ts
│   │
│   ├── ports/                       # Interfaces (Contratos)
│   │   ├── repositories/            # Contratos de repositórios
│   │   │   ├── user.repository.interface.ts
│   │   │   ├── meal.repository.interface.ts
│   │   │   └── workout.repository.interface.ts
│   │   └── services/                # Contratos de serviços externos
│   │       ├── ai.service.interface.ts
│   │       ├── storage.service.interface.ts
│   │       └── nutrition-calculator.service.interface.ts
│   │
│   └── dtos/                        # Data Transfer Objects
│       ├── auth/
│       │   ├── register.dto.ts
│       │   └── login.dto.ts
│       ├── meals/
│       │   ├── create-meal.dto.ts
│       │   └── meal-response.dto.ts
│       └── users/
│           ├── user-profile.dto.ts
│           └── update-profile.dto.ts
│
├── infrastructure/                  # Camada de Infraestrutura
│   ├── database/                    # Configuração de banco de dados
│   │   ├── typeorm/
│   │   │   ├── entities/            # Entidades TypeORM
│   │   │   │   ├── user.schema.ts
│   │   │   │   ├── meal.schema.ts
│   │   │   │   └── workout.schema.ts
│   │   │   └── repositories/        # Implementações de repositórios
│   │   │       ├── user.repository.ts
│   │   │       ├── meal.repository.ts
│   │   │       └── workout.repository.ts
│   │   ├── migrations/              # Migrations do banco
│   │   └── data-source.ts           # Configuração do TypeORM
│   │
│   ├── services/                    # Implementações de serviços
│   │   ├── ai/
│   │   │   └── claude-ai.service.ts
│   │   ├── storage/
│   │   │   └── local-storage.service.ts
│   │   └── nutrition/
│   │       └── nutrition-calculator.service.ts
│   │
│   └── config/                      # Configurações
│       ├── database.config.ts
│       ├── jwt.config.ts
│       └── app.config.ts
│
├── presentation/                    # Camada de Apresentação
│   ├── controllers/                 # Controllers REST
│   │   ├── auth.controller.ts
│   │   ├── meals.controller.ts
│   │   ├── users.controller.ts
│   │   └── workouts.controller.ts
│   │
│   ├── guards/                      # Guards de autenticação
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   │
│   ├── decorators/                  # Decorators customizados
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   │
│   ├── filters/                     # Exception filters
│   │   └── http-exception.filter.ts
│   │
│   └── middlewares/                 # Middlewares
│       └── logger.middleware.ts
│
├── shared/                          # Código compartilhado
│   ├── constants/
│   ├── utils/
│   └── types/
│
├── modules/                         # Módulos NestJS
│   ├── auth/
│   │   └── auth.module.ts
│   ├── users/
│   │   └── users.module.ts
│   ├── meals/
│   │   └── meals.module.ts
│   └── workouts/
│       └── workouts.module.ts
│
├── app.module.ts                    # Módulo raiz
└── main.ts                          # Entry point
```

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger:

- **Local**: http://localhost:3000/api/docs
- **Produção**: https://api.softfit.com/api/docs

### Principais Endpoints

#### Autenticação
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

#### Usuários
- `GET /api/v1/users/profile` - Obter perfil do usuário
- `PUT /api/v1/users/profile` - Atualizar perfil
- `PUT /api/v1/users/goals` - Atualizar metas nutricionais

#### Refeições
- `POST /api/v1/meals/photo` - Criar refeição via foto
- `POST /api/v1/meals/audio` - Criar refeição via áudio
- `GET /api/v1/meals` - Listar refeições
- `GET /api/v1/meals/:id` - Obter refeição específica
- `PUT /api/v1/meals/:id` - Atualizar refeição
- `DELETE /api/v1/meals/:id` - Deletar refeição

#### Treinos
- `POST /api/v1/workouts` - Criar ficha de treino
- `GET /api/v1/workouts` - Listar treinos
- `PUT /api/v1/workouts/:id` - Atualizar treino

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e

# Testes em modo watch
npm run test:watch
```

## 🗄️ Migrations

```bash
# Gerar nova migration
npm run migration:generate -- src/infrastructure/database/migrations/NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert
```

## 🚀 Deploy

### Docker

```bash
# Build da imagem
docker build -t softfit-backend .

# Executar container
docker-compose up -d
```

### Variáveis de Ambiente em Produção

Certifique-se de configurar as seguintes variáveis no ambiente de produção:
- `NODE_ENV=production`
- `JWT_SECRET` (use um valor forte e único)
- `ANTHROPIC_API_KEY`
- Configurações de banco de dados
- URLs do frontend

## 📝 Convenções de Código

- **Commits**: Seguir Conventional Commits
  - `feat:` nova funcionalidade
  - `fix:` correção de bug
  - `docs:` documentação
  - `refactor:` refatoração
  - `test:` testes
  
- **Branches**:
  - `main` - produção
  - `develop` - desenvolvimento
  - `feature/nome-da-feature` - novas funcionalidades
  - `fix/nome-do-fix` - correções

## 📖 Documentação Adicional

- [CONTEXT.md](./CONTEXT.md) - Contexto detalhado do projeto para IA/Manutenção
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Arquitetura detalhada
- [API.md](./docs/API.md) - Documentação completa da API

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial.

## 👥 Time

- **Desenvolvedor**: [Seu Nome]
- **Data de Início**: Fevereiro 2026

---

**Versão**: 1.0.0  
**Última Atualização**: Fevereiro 2026
