import { ApiProperty } from '@nestjs/swagger';
import { LinkStatus } from '@domain/enums';

export class NutritionistProfileResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  crn: string;

  @ApiProperty()
  crnState: string;

  @ApiProperty({ nullable: true })
  bio: string | null;

  @ApiProperty()
  specialties: string[];

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  activeClientsCount: number;

  @ApiProperty()
  createdAt: Date;
}

export class LinkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  nutritionistId: string;

  @ApiProperty({ enum: LinkStatus })
  status: LinkStatus;

  @ApiProperty()
  requestedAt: Date;

  @ApiProperty({ nullable: true })
  respondedAt: Date | null;

  @ApiProperty({ nullable: true })
  endedAt: Date | null;
}

export class NutritionPlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nutritionistId: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  plannedMeals: any[];

  @ApiProperty({ nullable: true })
  generalGuidelines: string | null;

  @ApiProperty({ nullable: true })
  durationDays: number | null;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ nullable: true })
  endDate: Date | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  daysRemaining: number | null;

  @ApiProperty()
  isExpired: boolean;

  @ApiProperty()
  createdAt: Date;
}
