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

@Entity('hydrations')
export class HydrationSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @Column({ name: 'volume_ml', type: 'float' })
  volumeMl: number;

  @Column({ name: 'drink_type', type: 'varchar', length: 50 })
  drinkType: string;

  @Column({ name: 'timestamp', type: 'timestamptz' })
  @Index()
  timestamp: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
