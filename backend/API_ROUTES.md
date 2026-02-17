# API Routes - SoftFit Backend

Documentação completa das rotas da API do SoftFit.

## Autenticação

Todas as rotas (exceto `/auth/*`) requerem autenticação via Bearer Token JWT.

### Headers necessários
```
Authorization: Bearer <token>
```

---

## 1. Autenticação (`/auth`)

### 1.1 Registro de Usuário
**POST** `/auth/register`

Registra um novo usuário (cliente ou nutricionista).

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "client" // ou "nutritionist"
}
```

**Response (201):**
```json
{
  "userId": "uuid",
  "email": "joao@email.com",
  "name": "João Silva",
  "role": "client",
  "accessToken": "jwt-token"
}
```

### 1.2 Login
**POST** `/auth/login`

Autentica um usuário existente.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "userId": "uuid",
  "email": "joao@email.com",
  "name": "João Silva",
  "role": "client",
  "accessToken": "jwt-token"
}
```

---

## 2. Perfil do Cliente (`/profile`)

Requer: `role: CLIENT`

### 2.1 Completar Onboarding
**POST** `/profile/onboarding`

Completa o onboarding do cliente com dados iniciais.

**Body:**
```json
{
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "heightCm": 175,
  "weightKg": 75.5,
  "goal": "lose_weight",
  "activityLevel": "moderately_active"
}
```

### 2.2 Obter Perfil
**GET** `/profile`

Retorna o perfil completo do usuário autenticado.

### 2.3 Atualizar Perfil
**PUT** `/profile`

Atualiza dados do perfil (altura, peso, objetivo, etc).

**Body:**
```json
{
  "weightKg": 74.0,
  "activityLevel": "very_active"
}
```

### 2.4 Atualizar Metas Manualmente
**PUT** `/profile/goals`

Permite ao usuário definir metas personalizadas.

**Body:**
```json
{
  "dailyCaloriesGoal": 2000,
  "dailyMacrosGoal": {
    "carbsGrams": 250,
    "proteinGrams": 150,
    "fatGrams": 60
  }
}
```

---

## 3. Refeições (`/meals`)

Requer: `role: CLIENT`

### 3.1 Registrar Refeição por Foto
**POST** `/meals/photo`

Upload de foto para processamento via IA.

**Form Data:**
- `photo`: arquivo de imagem (max 10MB)
- `mealTime` (opcional): timestamp da refeição

**Response (201):**
```json
{
  "suggestedName": "Almoço",
  "identifiedFoods": ["Arroz", "Feijão", "Frango"],
  "estimatedCalories": 650,
  "estimatedMacros": {
    "carbsGrams": 80,
    "proteinGrams": 45,
    "fatGrams": 20
  },
  "confidence": 85,
  "tempFileUrl": "url",
  "tempId": "temp-123"
}
```

### 3.2 Registrar Refeição por Áudio
**POST** `/meals/audio`

Upload de áudio descrevendo a refeição.

**Form Data:**
- `audio`: arquivo de áudio (max 10MB)
- `mealTime` (opcional): timestamp da refeição

### 3.3 Confirmar Refeição
**POST** `/meals/confirm`

Confirma e salva a refeição após processamento.

**Body:**
```json
{
  "name": "Almoço",
  "foods": ["Arroz", "Feijão", "Frango grelhado"],
  "calories": 650,
  "macros": {
    "carbsGrams": 80,
    "proteinGrams": 45,
    "fatGrams": 20
  },
  "mealTime": "2024-01-15T12:30:00Z"
}
```

### 3.4 Listar Refeições
**GET** `/meals?date=2024-01-15`

Lista todas as refeições de uma data específica.

**Query params:**
- `date` (opcional): data no formato YYYY-MM-DD

**Response (200):**
```json
{
  "meals": [...],
  "total": 3,
  "summary": {
    "totalCalories": 2000,
    "totalCarbs": 250,
    "totalProtein": 150,
    "totalFat": 67
  }
}
```

### 3.5 Visualizar Refeição
**GET** `/meals/:id`

Retorna detalhes de uma refeição específica.

### 3.6 Editar Refeição
**PUT** `/meals/:id`

Edita uma refeição existente (máximo 7 dias).

**Body:**
```json
{
  "name": "Almoço Atualizado",
  "calories": 700
}
```

### 3.7 Deletar Refeição
**DELETE** `/meals/:id`

Remove uma refeição.

---

## 4. Treinos (`/workouts`)

Requer: `role: CLIENT`

### 4.1 Criar Ficha de Treino
**POST** `/workouts`

Cria uma nova ficha de treino.

**Body:**
```json
{
  "name": "Treino A - Peito e Tríceps",
  "type": "ABC",
  "description": "Foco em hipertrofia"
}
```

### 4.2 Adicionar Exercício
**POST** `/workouts/:id/exercises`

Adiciona um exercício à ficha.

**Body:**
```json
{
  "name": "Supino reto",
  "muscleGroup": "chest",
  "sets": 4,
  "reps": "8-12",
  "restSeconds": 90,
  "notes": "Executar com controle",
  "order": 0
}
```

### 4.3 Listar Fichas
**GET** `/workouts`

Lista todas as fichas de treino do usuário.

### 4.4 Visualizar Ficha
**GET** `/workouts/:id`

Retorna detalhes da ficha com todos os exercícios.

### 4.5 Ativar/Desativar Ficha
**PUT** `/workouts/:id/activate`
**PUT** `/workouts/:id/deactivate`

Ativa ou desativa uma ficha de treino.

### 4.6 Remover Exercício
**DELETE** `/workouts/:workoutId/exercises/:exerciseId`

Remove um exercício da ficha.

---

## 5. Nutricionistas (`/nutritionists`)

### 5.1 Criar Perfil Profissional
**POST** `/nutritionists/profile`

Requer: `role: NUTRITIONIST`

Cria perfil profissional do nutricionista.

**Body:**
```json
{
  "fullName": "Dr. João Silva",
  "crn": "12345",
  "crnState": "SP",
  "bio": "Nutricionista especializado em nutrição esportiva",
  "specialties": ["Nutrição esportiva", "Emagrecimento"]
}
```

### 5.2 Buscar Nutricionistas
**GET** `/nutritionists/search?state=SP&specialty=esportiva`

Requer: `role: CLIENT`

Busca nutricionistas disponíveis.

### 5.3 Visualizar Perfil de Nutricionista
**GET** `/nutritionists/:id`

Requer: `role: CLIENT`

Visualiza perfil público de um nutricionista.

### 5.4 Solicitar Vínculo
**POST** `/nutritionists/link`

Requer: `role: CLIENT`

Solicita vínculo com um nutricionista.

**Body:**
```json
{
  "nutritionistId": "uuid"
}
```

### 5.5 Aceitar Solicitação
**PUT** `/nutritionists/link/:id/accept`

Requer: `role: NUTRITIONIST`

Aceita uma solicitação de vínculo.

### 5.6 Rejeitar Solicitação
**PUT** `/nutritionists/link/:id/reject`

Requer: `role: NUTRITIONIST`

Rejeita uma solicitação de vínculo.

### 5.7 Cancelar Vínculo
**PUT** `/nutritionists/link/:id/cancel`

Cancela um vínculo ativo (cliente ou nutricionista).

### 5.8 Listar Meus Clientes
**GET** `/nutritionists/my-clients`

Requer: `role: NUTRITIONIST`

Lista todos os clientes vinculados.

### 5.9 Visualizar Cliente
**GET** `/nutritionists/clients/:clientId`

Requer: `role: NUTRITIONIST`

Visualiza perfil e histórico de um cliente.

### 5.10 Ajustar Metas do Cliente
**PUT** `/nutritionists/clients/:clientId/goals`

Requer: `role: NUTRITIONIST`

Ajusta as metas nutricionais de um cliente.

**Body:**
```json
{
  "dailyCaloriesGoal": 1800,
  "dailyMacrosGoal": {
    "carbsGrams": 200,
    "proteinGrams": 140,
    "fatGrams": 55
  }
}
```

### 5.11 Criar Plano Alimentar
**POST** `/nutritionists/nutrition-plans`

Requer: `role: NUTRITIONIST`

Cria um plano alimentar para um cliente.

**Body:**
```json
{
  "clientId": "uuid",
  "title": "Plano para Emagrecimento - Janeiro 2024",
  "description": "Plano focado em déficit calórico",
  "plannedMeals": [
    {
      "name": "Café da Manhã",
      "time": "08:00",
      "foods": ["Pão integral", "Ovo mexido"],
      "portions": ["2 fatias", "2 unidades"],
      "observations": "Evitar açúcar"
    }
  ],
  "generalGuidelines": "Beber 2L de água por dia",
  "durationDays": 30,
  "startDate": "2024-01-15"
}
```

### 5.12 Listar Meus Planos
**GET** `/nutritionists/nutrition-plans/my-plans`

Requer: `role: CLIENT`

Lista planos alimentares recebidos.

### 5.13 Visualizar Plano
**GET** `/nutritionists/nutrition-plans/:id`

Visualiza detalhes de um plano alimentar.

---

## 6. Dashboard (`/dashboard`)

Requer: `role: CLIENT`

### 6.1 Dashboard Diário
**GET** `/dashboard/daily?date=2024-01-15`

Retorna resumo do dia com progresso das metas.

**Response (200):**
```json
{
  "date": "2024-01-15",
  "consumed": {
    "calories": 1500,
    "carbs": 180,
    "protein": 120,
    "fat": 50
  },
  "goals": {
    "calories": 2000,
    "carbs": 250,
    "protein": 150,
    "fat": 60
  },
  "progress": {
    "caloriesPercent": 75,
    "carbsPercent": 72,
    "proteinPercent": 80,
    "fatPercent": 83
  },
  "mealsCount": 3
}
```

### 6.2 Dashboard Semanal
**GET** `/dashboard/weekly?startDate=2024-01-15`

Retorna resumo semanal com gráficos de evolução.

### 6.3 Dashboard Mensal
**GET** `/dashboard/monthly?month=1&year=2024`

Retorna resumo mensal com estatísticas.

---

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem conteúdo de resposta
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email já existe)
- `500 Internal Server Error` - Erro interno

---

## Enums

### UserRole
- `client` - Cliente
- `nutritionist` - Nutricionista

### Gender
- `male` - Masculino
- `female` - Feminino
- `other` - Outro
- `prefer_not_to_say` - Prefiro não informar

### UserGoal
- `lose_weight` - Perder peso
- `gain_weight` - Ganhar peso/massa
- `maintain_weight` - Manter peso
- `improve_health` - Melhorar saúde

### ActivityLevel
- `sedentary` - Sedentário
- `lightly_active` - Levemente ativo
- `moderately_active` - Moderadamente ativo
- `very_active` - Muito ativo
- `extremely_active` - Extremamente ativo

### WorkoutType
- `A`, `B`, `C`, `D` - Treinos individuais
- `AB`, `ABC`, `ABCD`, `ABCDE` - Divisões
- `custom` - Personalizado

### MuscleGroup
- `chest` - Peito
- `back` - Costas
- `legs` - Pernas
- `shoulders` - Ombros
- `arms` - Braços
- `abs` - Abdômen
- `cardio` - Cardio
- `glutes` - Glúteos
- `full_body` - Corpo todo

### LinkStatus
- `pending` - Aguardando aceite
- `active` - Ativo
- `rejected` - Rejeitado
- `cancelled_by_client` - Cancelado pelo cliente
- `cancelled_by_nutritionist` - Cancelado pelo nutricionista

---

## Próximos Passos

Os controllers estão criados com as rotas definidas, mas os **use cases ainda precisam ser implementados**.

Para implementar cada funcionalidade, você precisará:

1. **Criar os use cases** em `src/application/use-cases/`
2. **Criar as interfaces de repositório** em `src/application/ports/repositories/`
3. **Criar os schemas TypeORM** em `src/infrastructure/database/typeorm/entities/`
4. **Criar as implementações dos repositórios** em `src/infrastructure/database/typeorm/repositories/`
5. **Registrar providers nos módulos** correspondentes

A estrutura de rotas está completa e documentada, faltando apenas a implementação da lógica de negócio.
