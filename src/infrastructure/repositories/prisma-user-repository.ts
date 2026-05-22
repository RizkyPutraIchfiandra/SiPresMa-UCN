import type { PrismaClient } from "@prisma/client";
import type { User } from "@/core/domain/entities";
import type { UserRepository } from "@/core/repositories/user-repository";

/**
 * Prisma-backed implementation of UserRepository.
 *
 * The mapper guarantees the service layer always sees `faceDescriptor` as
 * `number[]` even though Prisma stores it as `Json`.
 */
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private static toEntity(row: {
    id: string;
    nim: string;
    name: string;
    email: string;
    faceDescriptor: unknown;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    if (!Array.isArray(row.faceDescriptor)) {
      throw new Error(
        `Corrupt faceDescriptor for user ${row.id}: not an array`
      );
    }
    return {
      id: row.id,
      nim: row.nim,
      name: row.name,
      email: row.email,
      faceDescriptor: row.faceDescriptor as number[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async create(input: {
    nim: string;
    name: string;
    email: string;
    faceDescriptor: number[];
  }): Promise<User> {
    const row = await this.prisma.user.create({
      data: {
        nim: input.nim,
        name: input.name,
        email: input.email,
        faceDescriptor: input.faceDescriptor,
      },
    });
    return PrismaUserRepository.toEntity(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? PrismaUserRepository.toEntity(row) : null;
  }

  async findByNim(nim: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { nim } });
    return row ? PrismaUserRepository.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? PrismaUserRepository.toEntity(row) : null;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(PrismaUserRepository.toEntity);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}