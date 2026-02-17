import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@presentation/controllers/auth.controller';
import { RegisterUserUseCase } from '@application/use-cases/auth/register-user.usecase';
import { LoginUseCase } from '@application/use-cases/auth/login.usecase';
import { UserSchema } from '@infrastructure/database/typeorm/entities/user.schema';
import { TypeORMUserRepository } from '@infrastructure/database/typeorm/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';

/**
 * Módulo de Autenticação
 * Centraliza toda a funcionalidade de auth (registro, login, JWT)
 */
@Module({
  imports: [
    // TypeORM - Entity User
    TypeOrmModule.forFeature([UserSchema]),

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT Configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Strategies
    JwtStrategy,

    // Use Cases
    RegisterUserUseCase,
    LoginUseCase,

    // Repositories (Dependency Injection com interface)
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: TypeORMUserRepository,
    },
  ],
  exports: [
    JwtModule,
    PassportModule,
    JwtStrategy,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: TypeORMUserRepository,
    },
  ],
})
export class AuthModule {}
