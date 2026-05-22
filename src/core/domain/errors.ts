/**
 * Domain-level error hierarchy.
 *
 * These are thrown by services and translated into HTTP responses at the
 * route-handler boundary. Keeping them framework-agnostic means the service
 * layer doesn't need to know about Next.js or HTTP at all.
 */

export class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = "DOMAIN_ERROR", statusCode = 400) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, public readonly issues?: unknown) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class FaceNotRecognizedError extends DomainError {
  constructor(message = "Face not recognized") {
    super(message, "FACE_NOT_RECOGNIZED", 404);
    this.name = "FaceNotRecognizedError";
  }
}