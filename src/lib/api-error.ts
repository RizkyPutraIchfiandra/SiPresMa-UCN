import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError, ValidationError } from "@/core/domain/errors";

/**
 * Centralised error -> HTTP translator. Every route handler funnels its
 * thrown errors here so responses stay consistent.
 */
export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request payload",
          issues: err.issues,
        },
      },
      { status: 400 }
    );
  }

  if (err instanceof ValidationError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
          issues: err.issues,
        },
      },
      { status: err.statusCode }
    );
  }

  if (err instanceof DomainError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      { status: err.statusCode }
    );
  }

  console.error("[api] unexpected error:", err);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
    { status: 500 }
  );
}