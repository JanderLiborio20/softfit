import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Gender, UserGoal, ActivityLevel } from '@domain/enums';
import { UserSchema } from './user.schema';

@Entity('client_profiles')
export class ClientProfileSchema {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => UserSchema)
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'height_cm', type: 'decimal', precision: 5, scale: 1 })
  heightCm: number;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 5, scale: 1 })
  weightKg: number;

  @Column({ type: 'enum', enum: UserGoal })
  goal: UserGoal;

  @Column({ name: 'activity_level', type: 'enum', enum: ActivityLevel })
  activityLevel: ActivityLevel;

  @Column({ name: 'daily_calories_goal', type: 'int' })
  dailyCaloriesGoal: number;

  @Column({ name: 'daily_macros_carbs', type: 'int' })
  dailyMacrosCarbs: number;

  @Column({ name: 'daily_macros_protein', type: 'int' })
  dailyMacrosProtein: number;

  @Column({ name: 'daily_macros_fat', type: 'int' })
  dailyMacrosFat: number;

  @Column({ name: 'is_goal_manually_set', type: 'boolean', default: false })
  isGoalManuallySet: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
