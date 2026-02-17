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

@Entity('meals')
export class MealSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'audio_url', type: 'varchar', nullable: true })
  audioUrl: string | null;

  @Column({ type: 'simple-array' })
  foods: string[];

  @Column({ type: 'int' })
  calories: number;

  @Column({ name: 'macros_carbs', type: 'int' })
  macrosCarbs: number;

  @Column({ name: 'macros_protein', type: 'int' })
  macrosProtein: number;

  @Column({ name: 'macros_fat', type: 'int' })
  macrosFat: number;

  @Column({ name: 'meal_time', type: 'timestamptz' })
  @Index()
  mealTime: Date;

  @Column({ type: 'int', default: 0 })
  confidence: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
