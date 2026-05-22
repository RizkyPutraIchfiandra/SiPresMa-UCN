import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  Attendance,
  AttendanceStatus,
  AttendanceWithUser,
} from "@/core/domain/entities";
import type {
  AttendanceListFilter,
  AttendanceRepository,
} from "@/core/repositories/attendance-repository";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: {
    userId: string;
    status: AttendanceStatus;
    confidence: number;
    timestamp?: Date;
  }): Promise<Attendance> {
    const row = await this.prisma.attendance.create({
      data: {
        userId: input.userId,
        status: input.status,
        confidence: input.confidence,
        timestamp: input.timestamp ?? new Date(),
      },
    });
    return {
      id: row.id,
      userId: row.userId,
      status: row.status as AttendanceStatus,
      confidence: row.confidence,
      timestamp: row.timestamp,
    };
  }

  async findByUserOnDate(
    userId: string,
    date: Date
  ): Promise<Attendance | null> {
    const row = await this.prisma.attendance.findFirst({
      where: {
        userId,
        timestamp: { gte: startOfDay(date), lte: endOfDay(date) },
      },
      orderBy: { timestamp: "desc" },
    });
    if (!row) return null;
    return {
      id: row.id,
      userId: row.userId,
      status: row.status as AttendanceStatus,
      confidence: row.confidence,
      timestamp: row.timestamp,
    };
  }

  async list(filter: AttendanceListFilter): Promise<AttendanceWithUser[]> {
    const where: Prisma.AttendanceWhereInput = {};
    if (filter.from || filter.to) {
      where.timestamp = {};
      if (filter.from) where.timestamp.gte = filter.from;
      if (filter.to) where.timestamp.lte = filter.to;
    }
    if (filter.search) {
      where.user = {
        OR: [
          { name: { contains: filter.search, mode: "insensitive" } },
          { nim: { contains: filter.search, mode: "insensitive" } },
        ],
      };
    }

    const rows = await this.prisma.attendance.findMany({
      where,
      orderBy: { timestamp: "desc" },
      include: {
        user: { select: { id: true, nim: true, name: true, email: true } },
      },
      take: filter.limit ?? 200,
      skip: filter.offset ?? 0,
    });

    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      timestamp: r.timestamp,
      status: r.status as AttendanceStatus,
      confidence: r.confidence,
      user: r.user,
    }));
  }

  async countToday(): Promise<number> {
    const now = new Date();
    return this.prisma.attendance.count({
      where: {
        timestamp: { gte: startOfDay(now), lte: endOfDay(now) },
      },
    });
  }

  async countLastDays(
    days: number
  ): Promise<{ date: string; count: number }[]> {
    const now = new Date();
    const start = startOfDay(new Date(now.getTime() - (days - 1) * 86400000));

    const rows = await this.prisma.attendance.findMany({
      where: { timestamp: { gte: start } },
      select: { timestamp: true },
    });

    const buckets = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const r of rows) {
      const key = startOfDay(r.timestamp).toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    return Array.from(buckets.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}