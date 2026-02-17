import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ClientNutritionistLink } from '@domain/entities';
import { LinkStatus } from '@domain/enums';
import { IClientNutritionistLinkRepository } from '@application/ports/repositories';
import { ClientNutritionistLinkSchema } from '../entities/client-nutritionist-link.schema';

@Injectable()
export class TypeORMClientNutritionistLinkRepository implements IClientNutritionistLinkRepository {
  constructor(
    @InjectRepository(ClientNutritionistLinkSchema)
    private readonly repository: Repository<ClientNutritionistLinkSchema>,
  ) {}

  async save(link: ClientNutritionistLink): Promise<ClientNutritionistLink> {
    const schema = this.toSchema(link);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<ClientNutritionistLink | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async update(link: ClientNutritionistLink): Promise<ClientNutritionistLink> {
    const schema = this.toSchema(link);
    await this.repository.save(schema);
    return link;
  }

  async findByClientAndNutritionist(
    clientId: string,
    nutritionistId: string,
    statuses?: LinkStatus[],
  ): Promise<ClientNutritionistLink | null> {
    const where: any = { clientId, nutritionistId };
    if (statuses && statuses.length > 0) {
      where.status = In(statuses);
    }
    const schema = await this.repository.findOne({ where });
    return schema ? this.toDomain(schema) : null;
  }

  async findPendingByClientId(clientId: string): Promise<ClientNutritionistLink[]> {
    const schemas = await this.repository.find({
      where: { clientId, status: LinkStatus.PENDING },
      order: { requestedAt: 'DESC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async findActiveByNutritionistId(nutritionistId: string): Promise<ClientNutritionistLink[]> {
    const schemas = await this.repository.find({
      where: { nutritionistId, status: LinkStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  private toSchema(link: ClientNutritionistLink): ClientNutritionistLinkSchema {
    const schema = new ClientNutritionistLinkSchema();
    schema.id = link.id;
    schema.clientId = link.clientId;
    schema.nutritionistId = link.nutritionistId;
    schema.status = link.status;
    schema.requestedAt = link.requestedAt;
    schema.respondedAt = link.respondedAt;
    schema.endedAt = link.endedAt;
    schema.createdAt = link.createdAt;
    schema.updatedAt = link.updatedAt;
    return schema;
  }

  private toDomain(schema: ClientNutritionistLinkSchema): ClientNutritionistLink {
    return ClientNutritionistLink.reconstitute({
      id: schema.id,
      clientId: schema.clientId,
      nutritionistId: schema.nutritionistId,
      status: schema.status,
      requestedAt: schema.requestedAt,
      respondedAt: schema.respondedAt,
      endedAt: schema.endedAt,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
