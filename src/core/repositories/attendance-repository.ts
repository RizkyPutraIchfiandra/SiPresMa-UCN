import type {
  Attendance,
  AttendanceStatus,
  AttendanceWithUser,
} from "@/core/domain/entities";

export interface AttendanceListFilter {
  from?: Date;
  to?: Date;
  search?: string; // matches user name or NIM
  limit?: number;
  offset?: number;
}

export interface AttendanceRepository {
  create(input: {
    userId: string;
    status: AttendanceStatus;
    confidence: number;
    timestamp?: Date;
  }): Promise<Attendance>;

  /** Returns the latest attendance row for `userId` on the given calendar day, if any. */
  findByUserOnDate(userId: string, date: Date): Promise<Attendance | null>;

  list(filter: AttendanceListFilter): Promise<AttendanceWithUser[]>;

  countToday(): Promise<number>;

  /** Daily counts for the last `days` days, oldest first. */
  countLastDays(days: number): Promise<{ date: string; count: number }[]>;
}