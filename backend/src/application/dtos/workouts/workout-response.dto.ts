import { ApiProperty } from '@nestjs/swagger';
import { WorkoutType, MuscleGroup } from '@domain/enums';

export class ExerciseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: MuscleGroup })
  muscleGroup: MuscleGroup;

  @ApiProperty()
  sets: number;

  @ApiProperty()
  reps: string;

  @ApiProperty()
  restSeconds: number;

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty()
  order: number;
}

export class WorkoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: WorkoutType })
  type: WorkoutType;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [ExerciseResponseDto] })
  exercises?: ExerciseResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
