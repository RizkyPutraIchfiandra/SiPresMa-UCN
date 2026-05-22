import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/container";
import { UnauthorizedError } from "@/core/domain/errors";
import { toErrorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new UnauthorizedError();

    await container.userService.delete(params.id);
    return NextResponse.json({ data: { id: params.id } });
  } catch (err) {
    return toErrorResponse(err);
  }
}