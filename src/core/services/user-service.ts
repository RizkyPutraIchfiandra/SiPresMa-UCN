import { ConflictError, NotFoundError } from "@/core/domain/errors";
import { FaceDescriptor } from "@/core/domain/face-descriptor";
import type { User } from "@/core/domain/entities";
import type { UserRepository } from "@/core/repositories/user-repository";

export interface RegisterUserInput {
  nim: string;
  name: string;
  email: string;
  /** One or more 128-d descriptors captured client-side. They are averaged. */
  descriptors: number[][];
}

/**
 * Service Layer — orchestrates user-related business rules:
 *  - uniqueness of NIM and email
 *  - descriptor validation + averaging via the FaceDescriptor value object
 */
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(input: RegisterUserInput): Promise<User> {
    if (input.descriptors.length === 0) {
      throw new Error("At least one face descriptor is required");
    }

    const [byNim, byEmail] = await Promise.all([
      this.userRepo.findByNim(input.nim),
      this.userRepo.findByEmail(input.email),
    ]);
    if (byNim) throw new ConflictError("NIM is already registered");
    if (byEmail) throw new ConflictError("Email is already registered");

    const averaged = FaceDescriptor.average(
      input.descriptors.map((d) => FaceDescriptor.create(d))
    );

    return this.userRepo.create({
      nim: input.nim,
      name: input.name,
      email: input.email,
      faceDescriptor: averaged.toArray(),
    });
  }

  async list(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async delete(id: string): Promise<void> {
    const existing = await this.userRepo.findById(id);
    if (!existing) throw new NotFoundError("User");
    await this.userRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.userRepo.count();
  }
}