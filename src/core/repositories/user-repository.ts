import type { User } from "@/core/domain/entities";

/**
 * Repository Pattern — abstraction over user persistence.
 * Service layer depends on this interface, not on Prisma directly.
 */
export interface UserRepository {
  create(input: {
    nim: string;
    name: string;
    email: string;
    faceDescriptor: number[];
  }): Promise<User>;

  findById(id: string): Promise<User | null>;
  findByNim(nim: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  /**
   * Returns all users. Used by the matching service to compare a probe
   * descriptor against the enrolled population. For larger deployments this
   * should be replaced with a vector DB or a paged scan.
   */
  findAll(): Promise<User[]>;

  delete(id: string): Promise<void>;

  count(): Promise<number>;
}