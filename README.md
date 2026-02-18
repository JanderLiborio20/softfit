# SoftFit

Plataforma de gerenciamento nutricional com inteligencia artificial. O usuario registra refeicoes por foto ou descricao, acompanha macros e calorias, controla hidratacao, e recebe sugestoes de receitas da IA. Nutricionistas podem vincular-se a clientes e criar planos alimentares personalizados.

## Arquitetura

```
softfit/
├── backend/     NestJS API (Clean Architecture / DDD)
├── mobile/      React Native + Expo
└── README.md
```

### Backend

Organizado em camadas seguindo Clean Architecture:

```
backend/src/
├── domain/           Entidades, Value Objects, Enums, Exceptions
├── application/      Use Cases, DTOs, Ports (interfaces)
├── infrastructure/   TypeORM, Servicos de IA, JWT Strategy
├── presentation/     Controllers, Guards, Decorators
└── modules/          Modulos NestJS (DI wiring)
```

**Modulos:** Auth, Users, Profile, Meals, Hydration, Nutritionists, Dashboard, Workouts

### Mobile

```
mobile/src/
├── screens/          32 telas organizadas por feature
├── components/       Componentes reutilizaveis
├── contexts/         AuthContext (sessao do usuario)
└── services/         Funcoes de chamada a API
```

---

## Funcionalidades

### Cliente

| Feature | Descricao |
|---------|-----------|
| Onboarding | Cadastro com objetivo, sexo, idade, altura, peso, nivel de atividade. Calcula metas automaticamente (TMB + TDEE) |
| Registro por Foto | Tira foto da refeicao, IA identifica alimentos e calcula calorias/macros |
| Registro por Descricao | Descreve a refeicao por texto, IA analisa e retorna valores nutricionais |
| Dashboard | Grafico de calorias, resumo de macros (proteina, carboidratos, gordura), navegacao por data |
| Hidratacao | Registra ingestao de liquidos com tipo (agua, cafe, suco, etc) e volume |
| Sugestoes de Receitas | IA sugere 3 receitas baseadas nos macros que faltam no dia, com ingredientes e modo de preparo |
| Plano Alimentar | Visualiza plano alimentar ativo criado pelo nutricionista |
| Metas | Edita metas diarias de calorias e macros |
| Vinculos | Aceita/rejeita convites de nutricionistas |

### Nutricionista

| Feature | Descricao |
|---------|-----------|
| Cadastro Profissional | Registro com CRN e especializacao |
| Buscar Clientes | Pesquisa clientes por email para vincular |
| Vincular Cliente | Envia solicitacao de vinculo |
| Painel do Cliente | Visualiza perfil, metas, refeicoes do dia e plano ativo do cliente |
| Plano Alimentar | Cria planos alimentares com refeicoes, horarios, alimentos, porcoes e orientacoes |
| Gerenciar Planos | Visualiza detalhes e desativa planos |

### Inteligencia Artificial

4 provedores disponiveis (Groq ativo por padrao):

| Provedor | Modelos | SDK |
|----------|---------|-----|
| **Groq** (ativo) | `llama-4-scout-17b` (visao), `llama-3.3-70b-versatile` (texto/receitas) | OpenAI SDK |
| Claude | `claude-sonnet-4-20250514` | Anthropic SDK |
| OpenAI | `gpt-4o-mini` | OpenAI SDK |
| Gemini | `gemini-2.0-flash` | Google GenAI SDK |

Para trocar o provedor, altere `useClass` no `meals.module.ts`.

---

## Pre-requisitos

- **Node.js** >= 18
- **Docker** e **Docker Compose** (para PostgreSQL)
- **Expo CLI** (`npx expo`)
- Conta no [Groq](https://console.groq.com/) para obter `GROQ_API_KEY` (gratis)
- Dispositivo fisico ou emulador iOS/Android

---

## Como rodar

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url> softfit
cd softfit

# Backend
cd backend
npm install

# Mobile
cd ../mobile
npm install
```

### 2. Subir o banco de dados

```bash
cd backend
docker-compose up -d
```

Isso inicia o PostgreSQL na porta `5432` com:
- Usuario: `softfit`
- Senha: `softfit123`
- Banco: `softfit_db`

### 3. Configurar variaveis de ambiente

#### Backend

Copie o exemplo e preencha:

```bash
cp .env.example .env
```

Variaveis essenciais:

```env
# Banco
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=softfit
DB_PASSWORD=softfit123
DB_DATABASE=softfit_db
DB_SYNCHRONIZE=true

# JWT
JWT_SECRET=minha-chave-secreta
JWT_EXPIRES_IN=7d

# IA (obrigatorio - pelo menos o Groq)
GROQ_API_KEY=gsk_sua_chave_aqui

# Opcional (outros provedores)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
```

> **Nota:** `DB_SYNCHRONIZE=true` cria as tabelas automaticamente em dev. Em producao, use migrations.

#### Mobile

Crie o arquivo `.env` na raiz do mobile:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000/api/v1
```

> Substitua `SEU_IP_LOCAL` pelo IP da sua maquina na rede (ex: `192.168.15.8`). Use `ifconfig` ou `ipconfig` para descobrir. **Nao use `localhost`** — o emulador/dispositivo nao consegue acessar.

### 4. Iniciar o backend

```bash
cd backend
npm run start:dev
```

O servidor inicia em `http://localhost:3000/api/v1`.
Documentacao Swagger: `http://localhost:3000/api/v1/docs`

### 5. Iniciar o mobile

```bash
cd mobile
npx expo start
```

Escaneie o QR code com o app Expo Go (Android) ou Camera (iOS).

---

## Endpoints da API

Todos sob o prefixo `/api/v1`. Documentacao completa no Swagger.

### Auth (`/auth`) — publico
```
POST /auth/register          Cadastrar usuario
POST /auth/login             Login (retorna JWT)
POST /auth/change-password   Alterar senha
```

### Profile (`/profile`) — autenticado
```
POST /profile/onboarding     Completar onboarding (CLIENT)
GET  /profile                Buscar perfil
PUT  /profile                Atualizar perfil (CLIENT)
```

### Meals (`/meals`) — autenticado, role CLIENT
```
POST /meals/photo            Analisar foto de refeicao (multipart)
POST /meals/describe         Analisar descricao textual
POST /meals/suggest-recipes  Sugestoes de receitas pela IA
POST /meals/confirm          Confirmar e salvar refeicao
GET  /meals?date=YYYY-MM-DD  Listar refeicoes por data
```

### Hydration (`/hydration`) — autenticado, role CLIENT
```
POST   /hydration            Registrar ingestao
GET    /hydration?date=...   Listar registros por data
DELETE /hydration/:id        Remover registro
```

### Nutritionists (`/nutritionists`) — autenticado
```
POST /nutritionists/profile                         Criar perfil (NUTRITIONIST)
GET  /nutritionists/search-clients?email=...        Buscar cliente (NUTRITIONIST)
POST /nutritionists/link                            Enviar vinculo (NUTRITIONIST)
PUT  /nutritionists/link/:id/accept                 Aceitar vinculo (CLIENT)
PUT  /nutritionists/link/:id/reject                 Rejeitar vinculo (CLIENT)
GET  /nutritionists/my-links/pending                Vinculos pendentes (CLIENT)
GET  /nutritionists/my-clients                      Listar clientes (NUTRITIONIST)
GET  /nutritionists/clients/:clientId               Dados do cliente (NUTRITIONIST)
POST /nutritionists/nutrition-plans                 Criar plano (NUTRITIONIST)
GET  /nutritionists/nutrition-plans/client/:id      Listar planos (NUTRITIONIST)
GET  /nutritionists/nutrition-plans/:id             Detalhe do plano (NUTRITIONIST)
PUT  /nutritionists/nutrition-plans/:id/deactivate  Desativar plano (NUTRITIONIST)
GET  /nutritionists/my-plan                         Meu plano ativo (CLIENT)
```

---

## Stack Tecnica

### Backend
- **NestJS** 10 — framework
- **TypeORM** — ORM com PostgreSQL
- **Passport + JWT** — autenticacao
- **class-validator** — validacao de DTOs
- **Swagger** — documentacao automatica
- **Sharp** — processamento de imagens
- **OpenAI SDK / Anthropic SDK / Google GenAI** — integracao com IAs

### Mobile
- **React Native** 0.81 + **Expo** SDK 54
- **React Navigation** — navegacao nativa stack
- **Expo SecureStore** — armazenamento seguro de tokens
- **Expo ImagePicker** — captura de fotos
- **Expo AV** — gravacao de audio
- **React Native SVG** — graficos

---

## Scripts uteis

### Backend

```bash
npm run start:dev        # Modo desenvolvimento com hot-reload
npm run build            # Build de producao
npm run start:prod       # Iniciar build de producao
npm run lint             # Lint + fix
npm run test             # Rodar testes
npm run migration:run    # Rodar migrations
```

### Mobile

```bash
npx expo start           # Iniciar dev server
npx expo start --android # Abrir no Android
npx expo start --ios     # Abrir no iOS
npx tsc --noEmit         # Type-check sem build
```

---

## Estrutura do Banco

| Tabela | Descricao |
|--------|-----------|
| `users` | Usuarios (email, nome, senha, role) |
| `client_profiles` | Perfil do cliente (altura, peso, metas, macros) |
| `nutritionist_profiles` | Perfil do nutricionista (CRN, especializacao) |
| `client_nutritionist_links` | Vinculos entre cliente e nutricionista |
| `meals` | Refeicoes registradas (alimentos, calorias, macros, foto) |
| `hydration_logs` | Registros de hidratacao (tipo, volume) |
| `nutrition_plans` | Planos alimentares (refeicoes planejadas em JSON) |
| `exercises` | Exercicios para fichas de treino |
| `workouts` | Fichas de treino |
