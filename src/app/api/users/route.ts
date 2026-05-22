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

    const users = await container.userService.list();
    // Strip the descriptor from the response. It's not useful client-side and
    // makes the payload much smaller.
    return NextResponse.json({
      data: users.map(({ faceDescriptor, ...rest }) => rest),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}