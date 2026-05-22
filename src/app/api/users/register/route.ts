import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import { registerUserSchema } from "@/lib/validators/schemas";
import { toErrorResponse } from "@/lib/api-error";

// Prisma needs the Node.js runtime; do not deploy this route as edge.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const dto = registerUserSchema.parse(json);

    const user = await container.userService.register({
      nim: dto.nim,
      name: dto.name,
      email: dto.email,
      descriptors: dto.descriptors,
    });

    return NextResponse.json(
      {
        data: {
          id: user.id,
          nim: user.nim,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}