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
import { LinkStatus } from '@domain/enums';
import { UserSchema } from './user.schema';

@Entity('client_nutritionist_links')
export class ClientNutritionistLinkSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id', type: 'uuid' })
  @Index()
  clientId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'client_id' })
  client: UserSchema;

  @Column({ name: 'nutritionist_id', type: 'uuid' })
  @Index()
  nutritionistId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'nutritionist_id' })
  nutritionist: UserSchema;

  @Column({ type: 'enum', enum: LinkStatus, default: LinkStatus.PENDING })
  status: LinkStatus;

  @Column({ name: 'requested_at', type: 'timestamptz' })
  requestedAt: Date;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt: Date | null;

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
