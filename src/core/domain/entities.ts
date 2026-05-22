/**
 * Domain entities. These are plain types representing business concepts,
 * intentionally decoupled from Prisma so the service layer doesn't depend
 * on the ORM. Repository implementations are responsible for mapping
 * Prisma rows <-> these entities.
 */

export type AttendanceStatus = "PRESENT" | "LATE";
export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  nim: string;
  name: string;
  email: string;
  faceDescriptor: number[]; // 128-d
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  userId: string;
  timestamp: Date;
  status: AttendanceStatus;
  confidence: number;
}

export interface AttendanceWithUser extends Attendance {
  user: Pick<User, "id" | "nim" | "name" | "email">;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: Date;
}