import type { User } from "@/core/domain/entities";
import { FaceDescriptor } from "@/core/domain/face-descriptor";
import type { UserRepository } from "@/core/repositories/user-repository";
import type { FaceMatchingStrategy } from "@/core/services/face-matching-strategy";

export interface MatchResult {
  user: User;
  distance: number;
}

/**
 * Service Layer — face matching against the enrolled population.
 *
 * Uses a Strategy (FaceMatchingStrategy) for the actual distance metric,
 * and applies a configurable threshold. Below threshold = a match.
 */
export class FaceRecognitionService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly strategy: FaceMatchingStrategy,
    private readonly threshold: number
  ) {}

  async findBestMatch(probe: number[]): Promise<MatchResult | null> {
    // Validate descriptor shape up-front via the value object.
    const probeDescriptor = FaceDescriptor.create(probe);

    const users = await this.userRepo.findAll();
    if (users.length === 0) return null;

    let best: MatchResult | null = null;
    for (const user of users) {
      const distance = this.strategy.distance(
        probeDescriptor.toArray(),
        user.faceDescriptor
      );
      if (best === null || distance < best.distance) {
        best = { user, distance };
      }
    }

    if (!best) return null;
    return best.distance <= this.threshold ? best : null;
  }
}