import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MealsModule } from './modules/meals/meals.module';
import { ProfileModule } from './modules/profile/profile.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { NutritionistsModule } from './modules/nutritionists/nutritionists.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/guards/roles.guard';

/**
 * Módulo raiz da aplicação
 * Centraliza configurações globais e importa módulos de funcionalidade
 */
@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuração do TypeORM (PostgreSQL)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.schema{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
        logging: configService.get<boolean>('DB_LOGGING') || false,
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    // Módulos de funcionalidade
    AuthModule,
    UsersModule,
    MealsModule,
    ProfileModule,
    WorkoutsModule,
    NutritionistsModule,
    DashboardModule,
  ],
  providers: [
    // Guards globais
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
