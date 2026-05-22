import { describe, it, expect } from "vitest";
import { FaceRecognitionService } from "@/core/services/face-recognition-service";
import { EuclideanDistanceStrategy } from "@/infrastructure/strategies/euclidean-distance-strategy";
import { CosineSimilarityStrategy } from "@/infrastructure/strategies/cosine-similarity-strategy";
import { FACE_DESCRIPTOR_LENGTH } from "@/core/domain/face-descriptor";
import type { UserRepository } from "@/core/repositories/user-repository";
import type { User } from "@/core/domain/entities";

function descriptor(seed: number): number[] {
  // Deterministic 128-d vector that depends on `seed`.
  return Array.from({ length: FACE_DESCRIPTOR_LENGTH }, (_, i) =>
    Math.sin(seed * 0.31 + i * 0.07)
  );
}

function makeUser(id: string, seed: number): User {
  return {
    id,
    nim: `nim-${id}`,
    name: `User ${id}`,
    email: `${id}@test.com`,
    faceDescriptor: descriptor(seed),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

class InMemoryUserRepo implements UserRepository {
  constructor(private users: User[]) {}
  async create(): Promise<User> {
    throw new Error("not used");
  }
  async findById(id: string) {
    return this.users.find((u) => u.id === id) ?? null;
  }
  async findByNim() {
    return null;
  }
  async findByEmail() {
    return null;
  }
  async findAll() {
    return this.users;
  }
  async delete() {
    /* noop */
  }
  async count() {
    return this.users.length;
  }
}

describe("FaceRecognitionService", () => {
  it("returns the closest user when below threshold", async () => {
    const users = [makeUser("a", 1), makeUser("b", 50), makeUser("c", 100)];
    const repo = new InMemoryUserRepo(users);
    const svc = new FaceRecognitionService(
      repo,
      new EuclideanDistanceStrategy(),
      0.6
    );

    // Probe is exactly user "b"'s descriptor -> distance 0.
    const match = await svc.findBestMatch(descriptor(50));
    expect(match).not.toBeNull();
    expect(match!.user.id).toBe("b");
    expect(match!.distance).toBeCloseTo(0, 6);
  });

  it("returns null when nothing is within threshold", async () => {
    const users = [makeUser("a", 1)];
    const repo = new InMemoryUserRepo(users);
    const svc = new FaceRecognitionService(
      repo,
      new EuclideanDistanceStrategy(),
      0.0001 // absurdly strict
    );

    // Different seed => non-zero distance => above threshold.
    const match = await svc.findBestMatch(descriptor(999));
    expect(match).toBeNull();
  });

  it("returns null when there are no enrolled users", async () => {
    const repo = new InMemoryUserRepo([]);
    const svc = new FaceRecognitionService(
      repo,
      new EuclideanDistanceStrategy(),
      0.6
    );
    const match = await svc.findBestMatch(descriptor(1));
    expect(match).toBeNull();
  });

  it("works with the cosine strategy", async () => {
    const users = [makeUser("a", 1), makeUser("b", 50)];
    const repo = new InMemoryUserRepo(users);
    const svc = new FaceRecognitionService(
      repo,
      new CosineSimilarityStrategy(),
      0.4
    );
    const match = await svc.findBestMatch(descriptor(50));
    expect(match).not.toBeNull();
    expect(match!.user.id).toBe("b");
  });

  it("rejects malformed descriptors via the value object", async () => {
    const repo = new InMemoryUserRepo([makeUser("a", 1)]);
    const svc = new FaceRecognitionService(
      repo,
      new EuclideanDistanceStrategy(),
      0.6
    );
    await expect(svc.findBestMatch([1, 2, 3])).rejects.toThrow(
      /128 dimensions/
    );
  });
});