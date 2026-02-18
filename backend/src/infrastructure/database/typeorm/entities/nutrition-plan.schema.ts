import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserSchema } from './user.schema';

@Entity('nutrition_plans')
export class NutritionPlanSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nutritionist_id', type: 'uuid' })
  @Index()
  nutritionistId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'nutritionist_id' })
  nutritionist: UserSchema;

  @Column({ name: 'client_id', type: 'uuid' })
  @Index()
  clientId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'client_id' })
  client: UserSchema;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'planned_meals', type: 'jsonb' })
  plannedMeals: any[];

  @Column({ name: 'general_guidelines', type: 'text', nullable: true })
  generalGuidelines: string | null;

  @Column({ name: 'duration_days', type: 'int', nullable: true })
  durationDays: number | null;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
