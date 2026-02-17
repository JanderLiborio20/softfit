import { ClientProfile } from '@domain/entities';

export interface IClientProfileRepository {
  save(profile: ClientProfile): Promise<ClientProfile>;
  findByUserId(userId: string): Promise<ClientProfile | null>;
  update(profile: ClientProfile): Promise<ClientProfile>;
}
