import { prisma } from "@/infrastructure/database/prisma";
import { PrismaUserRepository } from "@/infrastructure/repositories/prisma-user-repository";
import { PrismaAttendanceRepository } from "@/infrastructure/repositories/prisma-attendance-repository";
import { PrismaAdminRepository } from "@/infrastructure/repositories/prisma-admin-repository";
import { EuclideanDistanceStrategy } from "@/infrastructure/strategies/euclidean-distance-strategy";
import { CosineSimilarityStrategy } from "@/infrastructure/strategies/cosine-similarity-strategy";
import { UserService } from "@/core/services/user-service";
import { FaceRecognitionService } from "@/core/services/face-recognition-service";
import { AttendanceService } from "@/core/services/attendance-service";
import { AttendanceEventBus } from "@/core/services/attendance-events";
import type { FaceMatchingStrategy } from "@/core/services/face-matching-strategy";

/**
 * Factory Pattern + lightweight DI container.
 *
 * Every service is instantiated once per Node process and re-used across
 * requests. This keeps allocations cheap on warm Vercel invocations and gives
 * us a single seam to swap implementations (e.g. for tests).
 */

function pickStrategy(): FaceMatchingStrategy {
  const name = (process.env.FACE_MATCH_STRATEGY ?? "euclidean").toLowerCase();
  switch (name) {
    case "cosine":
      return new CosineSimilarityStrategy();
    case "euclidean":
    default:
      return new EuclideanDistanceStrategy();
  }
}

function buildContainer() {
  const userRepo = new PrismaUserRepository(prisma);
  const attendanceRepo = new PrismaAttendanceRepository(prisma);
  const adminRepo = new PrismaAdminRepository(prisma);

  const strategy = pickStrategy();
  const threshold = Number.parseFloat(
    process.env.FACE_MATCH_THRESHOLD ?? String(strategy.defaultThreshold)
  );

  const events = new AttendanceEventBus();

  // Default observer: log to console. In production this could publish to
  // a queue, send a notification, etc.
  events.subscribe((e) => {
    console.log(
      `[attendance] ${e.user.nim} (${e.user.name}) status=${e.attendance.status} dist=${e.matchDistance.toFixed(4)}`
    );
  });

  const userService = new UserService(userRepo);
  const faceRecognition = new FaceRecognitionService(
    userRepo,
    strategy,
    Number.isFinite(threshold) ? threshold : strategy.defaultThreshold
  );
  const attendanceService = new AttendanceService(
    attendanceRepo,
    faceRecognition,
    events
  );

  return {
    prisma,
    userRepo,
    attendanceRepo,
    adminRepo,
    strategy,
    threshold,
    events,
    userService,
    faceRecognition,
    attendanceService,
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __appContainer: ReturnType<typeof buildContainer> | undefined;
}

export const container =
  globalThis.__appContainer ?? (globalThis.__appContainer = buildContainer());