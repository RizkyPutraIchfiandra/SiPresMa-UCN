import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/container";
import { attendanceListQuerySchema } from "@/lib/validators/schemas";
import { UnauthorizedError } from "@/core/domain/errors";
import { toErrorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new UnauthorizedError();

    const url = new URL(req.url);
    const dto = attendanceListQuerySchema.parse(
      Object.fromEntries(url.searchParams)
    );

    const list = await container.attendanceService.list({
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
      search: dto.search,
      limit: dto.limit,
      offset: dto.offset,
    });

    return NextResponse.json({ data: list });
  } catch (err) {
    return toErrorResponse(err);
  }
}