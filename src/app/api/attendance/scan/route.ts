import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import { scanAttendanceSchema } from "@/lib/validators/schemas";
import { toErrorResponse } from "@/lib/api-error";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const dto = scanAttendanceSchema.parse(json);

    const result = await container.attendanceService.scan(dto.descriptor);

    return NextResponse.json({
      data: {
        user: result.user,
        attendance: {
          id: result.attendance.id,
          status: result.attendance.status,
          timestamp: result.attendance.timestamp,
          confidence: result.attendance.confidence,
        },
        distance: result.distance,
        alreadyAttendedToday: result.alreadyAttendedToday,
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}