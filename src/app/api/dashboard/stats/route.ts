import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/container";
import { UnauthorizedError } from "@/core/domain/errors";
import { toErrorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new UnauthorizedError();

    const [totalUsers, presentToday, last7Days] = await Promise.all([
      container.userService.count(),
      container.attendanceService.countToday(),
      container.attendanceService.countLastDays(7),
    ]);

    const attendanceRate =
      totalUsers === 0 ? 0 : Math.round((presentToday / totalUsers) * 100);

    return NextResponse.json({
      data: {
        totalUsers,
        presentToday,
        attendanceRate,
        last7Days,
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}