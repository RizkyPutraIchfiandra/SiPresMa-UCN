import type { AttendanceWithUser, Attendance } from "@/core/domain/entities";
import { FaceNotRecognizedError } from "@/core/domain/errors";
import type {
  AttendanceListFilter,
  AttendanceRepository,
} from "@/core/repositories/attendance-repository";
import type { AttendanceEventBus } from "@/core/services/attendance-events";
import type { FaceRecognitionService } from "@/core/services/face-recognition-service";

export interface ScanResult {
  user: { id: string; nim: string; name: string };
  attendance: Attendance;
  distance: number;
  /**
   * True when this scan happened *after* the user had already checked in
   * today. The result still resolves successfully (we return the existing
   * attendance), but the UI labels it differently so users see a friendly
   * "already marked present" message instead of a scary error.
   */
  alreadyAttendedToday: boolean;
}

const LATE_HOUR_24 = 9; // anything from 09:00 onward is marked LATE

/**
 * Service Layer — the attendance flow.
 *
 * Responsibilities:
 *  - delegate face matching to FaceRecognitionService
 *  - enforce "one attendance per user per day" (returns existing, not error)
 *  - decide PRESENT vs LATE based on time of day
 *  - publish a domain event so observers (logging, notifications) can react
 */
export class AttendanceService {
  constructor(
    private readonly attendanceRepo: AttendanceRepository,
    private readonly faceRecognition: FaceRecognitionService,
    private readonly events: AttendanceEventBus
  ) {}

  async scan(probe: number[]): Promise<ScanResult> {
    const match = await this.faceRecognition.findBestMatch(probe);
    if (!match) {
      throw new FaceNotRecognizedError();
    }

    const now = new Date();
    const existing = await this.attendanceRepo.findByUserOnDate(
      match.user.id,
      now
    );

    // Already attended today — return the existing record instead of failing.
    // The UI uses `alreadyAttendedToday` to render a friendly message.
    if (existing) {
      return {
        user: { id: match.user.id, nim: match.user.nim, name: match.user.name },
        attendance: existing,
        distance: match.distance,
        alreadyAttendedToday: true,
      };
    }

    const status = now.getHours() >= LATE_HOUR_24 ? "LATE" : "PRESENT";
    // Confidence: distance 0 => 1.0, distance == threshold => 0.0.
    // We can't reach the threshold here because matches above it are filtered
    // out, but we still clamp defensively.
    const confidence = Math.max(0, 1 - match.distance);

    const attendance = await this.attendanceRepo.create({
      userId: match.user.id,
      status,
      confidence,
      timestamp: now,
    });

    await this.events.publish({
      type: "attendance.recorded",
      user: {
        id: match.user.id,
        nim: match.user.nim,
        name: match.user.name,
      },
      attendance,
      matchDistance: match.distance,
    });

    return {
      user: { id: match.user.id, nim: match.user.nim, name: match.user.name },
      attendance,
      distance: match.distance,
      alreadyAttendedToday: false,
    };
  }

  async list(filter: AttendanceListFilter): Promise<AttendanceWithUser[]> {
    return this.attendanceRepo.list(filter);
  }

  async countToday(): Promise<number> {
    return this.attendanceRepo.countToday();
  }

  async countLastDays(days: number) {
    return this.attendanceRepo.countLastDays(days);
  }
}