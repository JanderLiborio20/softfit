# CONTEXT.md - SoftFit Backend

> **Este arquivo serve como contexto completo do projeto para facilitar manutenção, debugging e evolução do sistema. Leia SEMPRE antes de fazer alterações.**

## 🎯 Propósito do Sistema

O SoftFit Backend é uma API REST que:
1. **Processa fotos de refeições** usando IA (Claude) para identificar alimentos e calcular macros
2. **Processa áudios** onde usuários descrevem o que comeram
3. **Gerencia usuários** (clientes e nutricionistas) com autenticação JWT
4. **Calcula metas nutricionais** automaticamente baseado em dados antropométricos
5. **Gerencia treinos** permitindo criação de fichas personalizadas
6. **Conecta nutricionistas a clientes** para acompanhamento profissional

## 🏗️ Arquitetura - Clean Architecture (Hexagonal)

### Por que Clean Architecture?

Escolhemos essa arquitetura porque:
- ✅ **Testabilidade**: Lógica de negócio isolada, fácil de testar
- ✅ **Manutenibilidade**: Mudanças em frameworks não afetam regras de negócio
- ✅ **Escalabilidade**: Fácil adicionar novos casos de uso
- ✅ **Independência**: Domain não conhece infraestrutura

### Fluxo de Dados

```
Request → Controller → Use Case → Repository Interface → Repository Implementation → Database
                          ↓
                    Domain Entity
                          ↓
                    Business Rules
                          ↓
                   Response DTO ← Controller
```

### Camadas e Responsabilidades

#### 1. Domain (Núcleo)
**Localização**: `src/domain/`
**Responsabilidade**: Regras de negócio puras, independente de frameworks

**Contém**:
- **Entities**: Objetos de negócio (User, Meal, Workout)
- **Value Objects**: Objetos imutáveis (Email, Password, Macros)
- **Enums**: Enumerações do domínio (UserGoal, ActivityLevel)
- **Exceptions**: Exceções de domínio (BusinessRuleException)

**Regra de Ouro**: Esta camada NÃO pode depender de nenhuma outra camada!

```typescript
// ✅ CORRETO - Domain Entity pura
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email, // Value Object
    public readonly name: string,
  ) {}
  
  // Regra de negócio no domínio
  canEditMealOlderThan(days: number): boolean {
    return days <= 7; // RN008 da documentação
  }
}

// ❌ ERRADO - Domain não pode depender de infraestrutura
import { Repository } from 'typeorm'; // NÃO FAZER ISSO!
```

#### 2. Application (Casos de Uso)
**Localização**: `src/application/`
**Responsabilidade**: Orquestração de lógica de negócio

**Contém**:
- **Use Cases**: Casos de uso específicos (RegisterUserUseCase)
- **DTOs**: Objetos de transferência de dados
- **Ports (Interfaces)**: Contratos que a infraestrutura deve implementar

**Princípio**: Use Cases orquestram, Domain executa regras

```typescript
// Exemplo de Use Case
export class CreateMealFromPhotoUseCase {
  constructor(
    private readonly aiService: IAIService, // Port (interface)
    private readonly mealRepository: IMealRepository, // Port (interface)
    private readonly storageService: IStorageService, // Port (interface)
  ) {}

  async execute(dto: CreateMealFromPhotoDto): Promise<MealResponseDto> {
    // 1. Upload da imagem
    const imageUrl = await this.storageService.upload(dto.photo);
    
    // 2. Processar com IA
    const analysis = await this.aiService.analyzeFoodImage(imageUrl);
    
    // 3. Criar entidade de domínio
    const meal = Meal.create({
      userId: dto.userId,
      imageUrl,
      ...analysis,
    });
    
    // 4. Persistir
    return this.mealRepository.save(meal);
  }
}
```

#### 3. Infrastructure (Implementações)
**Localização**: `src/infrastructure/`
**Responsabilidade**: Detalhes técnicos e implementações concretas

**Contém**:
- **Repositories**: Implementações TypeORM dos contratos
- **Services**: Implementações de serviços externos (Claude AI, Storage)
- **Database**: Schemas TypeORM, migrations
- **Config**: Configurações de ambiente

**Princípio**: Adapters que implementam os Ports definidos na Application

```typescript
// Implementação do Port IAIService
export class ClaudeAIService implements IAIService {
  private client: Anthropic;
  
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeFoodImage(imageUrl: string): Promise<FoodAnalysis> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl,
            }
          },
          {
            type: 'text',
            text: 'Analise esta imagem e retorne JSON com: alimentos identificados, calorias, carboidratos, proteínas, gorduras'
          }
        ]
      }]
    });
    
    return this.parseResponse(response);
  }
}
```

#### 4. Presentation (Interface)
**Localização**: `src/presentation/`
**Responsabilidade**: Lidar com requisições HTTP

**Contém**:
- **Controllers**: Endpoints REST
- **Guards**: Autenticação/Autorização
- **Filters**: Tratamento de exceções
- **Decorators**: Decorators customizados

```typescript
@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(
    private readonly createMealUseCase: CreateMealFromPhotoUseCase
  ) {}

  @Post('photo')
  @UseInterceptors(FileInterceptor('photo'))
  async createFromPhoto(
    @UploadedFile() photo: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const dto = new CreateMealFromPhotoDto(photo, user.id);
    return this.createMealUseCase.execute(dto);
  }
}
```

## 🔑 Conceitos-Chave do Projeto

### 1. Processamento de Imagens com Claude

**Fluxo**:
1. Cliente envia foto via multipart/form-data
2. Backend salva temporariamente e otimiza com Sharp
3. Converte para base64 ou URL
4. Envia para Claude API com prompt específico
5. Claude retorna JSON estruturado com análise
6. Backend valida e salva no banco

**Prompt para Claude** (em `ClaudeAIService`):
```
Analise esta imagem de comida e retorne APENAS um JSON válido com:
{
  "foods": ["alimento1", "alimento2"],
  "calories": número,
  "macros": {
    "carbs": número em gramas,
    "protein": número em gramas,
    "fat": número em gramas
  },
  "mealName": "sugestão baseada no horário",
  "confidence": 0-100
}

Regras:
- Use valores realistas baseados em porções médias
- Se não identificar algo, retorne confidence baixo
- mealName deve ser: Café da Manhã, Almoço, Jantar, Lanche, etc
```

### 2. Cálculo de Metas Nutricionais

**Fórmulas implementadas em** `NutritionCalculatorService`:

```typescript
// TMB (Taxa Metabólica Basal) - Fórmula Mifflin-St Jeor
TMB_homem = (10 × peso_kg) + (6.25 × altura_cm) - (5 × idade) + 5
TMB_mulher = (10 × peso_kg) + (6.25 × altura_cm) - (5 × idade) - 161

// TDEE (Total Daily Energy Expenditure)
TDEE = TMB × fator_atividade

// Fatores de atividade:
Sedentário = 1.2
Leve = 1.375
Moderado = 1.55
Pesado = 1.725
Atleta = 1.9

// Ajuste por objetivo:
Perder peso = TDEE - 500 kcal (déficit)
Ganhar peso = TDEE + 300 kcal (superávit)
Manter peso = TDEE

// Distribuição de macros (padrão):
Proteínas = 30% das calorias (÷4 = gramas)
Carboidratos = 40% das calorias (÷4 = gramas)
Gorduras = 30% das calorias (÷9 = gramas)
```

### 3. Autenticação JWT

**Estratégia**:
- Access Token: 7 dias (configurável)
- Refresh Token: 30 dias (futuro)
- Payload: { userId, email, role }

**Guards**:
- `JwtAuthGuard`: Valida token em rotas protegidas
- `RolesGuard`: Valida papel do usuário (client/nutritionist)

### 4. Upload de Arquivos

**Configurações**:
- Tamanho máximo: 10MB (RNF006)
- Formatos aceitos: jpg, jpeg, png, webp
- Armazenamento: Local (desenvolvimento), S3 (produção)
- Otimização: Sharp para redimensionar e comprimir

## 📊 Modelo de Dados

### Entidades Principais

```
User (Cliente ou Nutricionista)
├── id: UUID
├── email: string (único)
├── password: string (hash bcrypt)
├── name: string
├── role: 'client' | 'nutritionist'
├── profile: UserProfile (OneToOne)
└── meals: Meal[] (OneToMany)

UserProfile
├── id: UUID
├── userId: UUID (FK)
├── dateOfBirth: Date
├── gender: 'male' | 'female' | 'other'
├── height: number (cm)
├── weight: number (kg)
├── activityLevel: enum
├── goal: enum
└── goals: NutritionalGoals (embedded)

NutritionalGoals (Value Object)
├── calories: number
├── carbs: number
├── protein: number
└── fat: number

Meal
├── id: UUID
├── userId: UUID (FK)
├── name: string
├── imageUrl: string
├── foods: string[]
├── calories: number
├── macros: Macros (embedded)
├── mealTime: DateTime
├── confidence: number
└── createdAt: DateTime

Workout
├── id: UUID
├── userId: UUID (FK)
├── name: string
├── type: 'A' | 'B' | 'C' | 'ABC' | 'ABCD'
├── exercises: Exercise[] (embedded)
└── createdAt: DateTime

NutritionistClient (Relacionamento)
├── nutritionistId: UUID (FK)
├── clientId: UUID (FK)
├── status: 'pending' | 'active' | 'inactive'
├── createdAt: DateTime
└── endedAt: DateTime?
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente Críticas

```env
# ⚠️ NUNCA commitar valores reais!

# Claude AI - ESSENCIAL para processamento de imagens
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# JWT - Trocar em produção por valor forte
JWT_SECRET=seu-secret-super-seguro-aqui

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=softfit
DB_PASSWORD=senha-forte
DB_DATABASE=softfit_db
```

### Limites e Restrições

- **Upload**: 10MB por arquivo (configurado em `MulterModule`)
- **Rate Limit**: 100 requisições/minuto por IP (implementar)
- **JWT Expiration**: 7 dias
- **Histórico editável**: 7 dias (RN008)
- **Clientes por nutricionista**: 100 (RN004)

## 🐛 Debugging e Troubleshooting

### Logs Importantes

O sistema usa `Logger` do NestJS. Logs principais:
- `[ClaudeAIService]` - Processamento de IA
- `[MealRepository]` - Operações de banco
- `[AuthService]` - Autenticação
- `[UploadService]` - Upload de arquivos

### Problemas Comuns

#### 1. "Cannot connect to database"
**Solução**: 
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar credenciais em .env
# Verificar se database existe
psql -U postgres -c "\l"
```

#### 2. "Claude API error 401"
**Solução**: Verificar `ANTHROPIC_API_KEY` no `.env`

#### 3. "File too large"
**Solução**: Ajustar `MAX_FILE_SIZE` em `.env` ou otimizar imagem antes do upload

#### 4. "Migration error"
**Solução**:
```bash
# Verificar status das migrations
npm run typeorm migration:show

# Reverter se necessário
npm run migration:revert

# Executar novamente
npm run migration:run
```

## 🧪 Testes

### Estratégia de Testes

1. **Unit Tests**: Casos de uso isolados com mocks
2. **Integration Tests**: Módulos completos com banco de teste
3. **E2E Tests**: Fluxos completos via HTTP

### Exemplo de Teste Unitário

```typescript
describe('CreateMealFromPhotoUseCase', () => {
  let useCase: CreateMealFromPhotoUseCase;
  let aiService: jest.Mocked<IAIService>;
  let mealRepository: jest.Mocked<IMealRepository>;

  beforeEach(() => {
    aiService = {
      analyzeFoodImage: jest.fn(),
    } as any;
    
    mealRepository = {
      save: jest.fn(),
    } as any;
    
    useCase = new CreateMealFromPhotoUseCase(
      aiService,
      mealRepository,
      storageService,
    );
  });

  it('should create meal from photo', async () => {
    const mockAnalysis = {
      foods: ['arroz', 'feijão'],
      calories: 450,
      macros: { carbs: 60, protein: 20, fat: 10 }
    };
    
    aiService.analyzeFoodImage.mockResolvedValue(mockAnalysis);
    
    const result = await useCase.execute(mockDto);
    
    expect(result.calories).toBe(450);
    expect(aiService.analyzeFoodImage).toHaveBeenCalledTimes(1);
  });
});
```

## 🚀 Próximos Passos / Roadmap

### Fase 1 - MVP (Atual)
- [x] Estrutura do projeto
- [x] Autenticação JWT
- [ ] Upload de fotos
- [ ] Integração com Claude
- [ ] CRUD de refeições
- [ ] Cálculo de metas

### Fase 2
- [ ] Processamento de áudio
- [ ] CRUD de treinos
- [ ] Dashboard do usuário
- [ ] Vinculação nutricionista-cliente

### Fase 3
- [ ] Planos alimentares
- [ ] Relatórios de evolução
- [ ] Notificações push
- [ ] Chat nutricionista-cliente

## 💡 Decisões de Design Importantes

### Por que TypeORM ao invés de Prisma?
- ✅ Melhor suporte a migrations complexas
- ✅ Decorators nativos do NestJS
- ✅ Maior controle sobre queries

### Por que Clean Architecture?
- ✅ Facilita testes (mock de interfaces)
- ✅ Domain isolado de frameworks
- ✅ Fácil trocar implementações (ex: trocar PostgreSQL por MongoDB)

### Por que não Microserviços?
- Para MVP, monolito modular é suficiente
- Clean Architecture permite migração futura para microserviços
- Cada módulo já é independente

## 📞 Referências Rápidas

### Comandos Úteis
```bash
# Iniciar dev
npm run start:dev

# Gerar migration
npm run migration:generate -- src/infrastructure/database/migrations/NomeMigration

# Rodar testes
npm test

# Build produção
npm run build

# Lint
npm run lint
```

### Arquivos Importantes
- `src/main.ts` - Entry point, configuração global
- `src/app.module.ts` - Módulo raiz, imports
- `.env` - Variáveis de ambiente (NÃO versionar)
- `src/infrastructure/database/data-source.ts` - Configuração TypeORM

## ✅ Checklist de Manutenção

Antes de fazer mudanças:
- [ ] Li este CONTEXT.md completamente
- [ ] Entendi a camada que vou modificar
- [ ] Verifiquei se há testes relacionados
- [ ] Confirmo que não estou violando a Dependency Rule
- [ ] Vou adicionar/atualizar testes
- [ ] Vou atualizar documentação se necessário

## 🎓 Aprendizado Contínuo

### Recursos
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com)
- [Anthropic Claude API](https://docs.anthropic.com)

---

**Este documento é vivo!** Atualize-o sempre que fizer mudanças arquiteturais importantes.

**Última atualização**: Fevereiro 2026
