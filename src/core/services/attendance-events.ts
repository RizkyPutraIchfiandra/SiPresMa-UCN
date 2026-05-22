import type { Attendance, User } from "@/core/domain/entities";

/**
 * Observer Pattern — listeners can subscribe to attendance events
 * (e.g. for logging, notifications, analytics). Decouples side-effects
 * from the core attendance flow.
 */

export interface AttendanceRecordedEvent {
  type: "attendance.recorded";
  user: Pick<User, "id" | "nim" | "name">;
  attendance: Attendance;
  matchDistance: number;
}

export type AttendanceEvent = AttendanceRecordedEvent;

export type AttendanceObserver = (event: AttendanceEvent) => void | Promise<void>;

export class AttendanceEventBus {
  private observers: AttendanceObserver[] = [];

  subscribe(observer: AttendanceObserver): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((o) => o !== observer);
    };
  }

  async publish(event: AttendanceEvent): Promise<void> {
    // Fire-and-forget but we still await so a noisy observer can't silently
    // swallow errors during request handling.
    await Promise.all(
      this.observers.map(async (o) => {
        try {
          await o(event);
        } catch (err) {
          console.error("[AttendanceEventBus] observer error:", err);
        }
      })
    );
  }
}