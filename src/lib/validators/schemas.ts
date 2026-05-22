import { z } from "zod";
import { FACE_DESCRIPTOR_LENGTH } from "@/core/domain/face-descriptor";

/**
 * DTO Pattern — Zod schemas describe the shape of API requests.
 * Service inputs are derived from these via `z.infer`, keeping route handlers
 * thin and giving us runtime validation for free.
 */

export const descriptorSchema = z
  .array(z.number().finite())
  .length(FACE_DESCRIPTOR_LENGTH, {
    message: `Descriptor must have ${FACE_DESCRIPTOR_LENGTH} values`,
  });

export const registerUserSchema = z.object({
  nim: z
    .string()
    .trim()
    .min(3, "NIM must be at least 3 characters")
    .max(32, "NIM is too long"),
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Invalid email address"),
  descriptors: z
    .array(descriptorSchema)
    .min(1, "At least one face capture is required")
    .max(10, "Too many captures"),
});
export type RegisterUserDTO = z.infer<typeof registerUserSchema>;

export const scanAttendanceSchema = z.object({
  descriptor: descriptorSchema,
});
export type ScanAttendanceDTO = z.infer<typeof scanAttendanceSchema>;

export const attendanceListQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().trim().min(1).max(64).optional(),
  limit: z.coerce.number().int().positive().max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
export type AttendanceListQueryDTO = z.infer<typeof attendanceListQuerySchema>;

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});
export type AdminLoginDTO = z.infer<typeof adminLoginSchema>;