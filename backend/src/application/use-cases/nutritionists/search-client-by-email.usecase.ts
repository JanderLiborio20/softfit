import { Injectable, Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@application/ports/repositories';

@Injectable()
export class SearchClientByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(email: string): Promise<{ userId: string; name: string; email: string } | null> {
    const user = await this.userRepo.findByEmail(email.trim().toLowerCase());
    if (!user || !user.isClient()) {
      return null;
    }
    return {
      userId: user.id,
      name: user.name,
      email: user.getEmail(),
    };
  }
}
