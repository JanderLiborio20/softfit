import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserSchema } from './user.schema';

@Entity('nutritionist_profiles')
export class NutritionistProfileSchema {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => UserSchema)
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @Column({ length: 6 })
  crn: string;

  @Column({ name: 'crn_state', length: 2 })
  crnState: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'simple-array' })
  specialties: string[];

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'active_clients_count', type: 'int', default: 0 })
  activeClientsCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
