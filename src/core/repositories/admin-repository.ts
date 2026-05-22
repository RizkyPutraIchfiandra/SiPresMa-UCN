import type { AdminUser } from "@/core/domain/entities";

export interface AdminRepository {
  findByUsername(username: string): Promise<AdminUser | null>;
}