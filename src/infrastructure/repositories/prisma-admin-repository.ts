import type { PrismaClient } from "@prisma/client";
import type { AdminUser, AdminRole } from "@/core/domain/entities";
import type { AdminRepository } from "@/core/repositories/admin-repository";

export class PrismaAdminRepository implements AdminRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<AdminUser | null> {
    const row = await this.prisma.adminUser.findUnique({ where: { username } });
    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      passwordHash: row.passwordHash,
      role: row.role as AdminRole,
      createdAt: row.createdAt,
    };
  }
}