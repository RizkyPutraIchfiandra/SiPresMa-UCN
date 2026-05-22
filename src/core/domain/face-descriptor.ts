/**
 * Value object for a face descriptor.
 *
 * Encapsulates invariants (length must be 128, all finite numbers) and
 * exposes a small API for averaging multiple captures during registration.
 */

export const FACE_DESCRIPTOR_LENGTH = 128;

export class FaceDescriptor {
  private constructor(public readonly values: ReadonlyArray<number>) {}

  static create(values: number[] | Float32Array): FaceDescriptor {
    const arr = Array.from(values);

    if (arr.length !== FACE_DESCRIPTOR_LENGTH) {
      throw new Error(
        `Face descriptor must have ${FACE_DESCRIPTOR_LENGTH} dimensions, got ${arr.length}`
      );
    }
    if (!arr.every((n) => Number.isFinite(n))) {
      throw new Error("Face descriptor contains non-finite values");
    }

    return new FaceDescriptor(arr);
  }

  /**
   * Average several descriptors element-wise. Used during registration where
   * the client sends multiple captures to make the stored vector more robust.
   */
  static average(descriptors: FaceDescriptor[]): FaceDescriptor {
    if (descriptors.length === 0) {
      throw new Error("Cannot average empty descriptor list");
    }
    const summed = new Array<number>(FACE_DESCRIPTOR_LENGTH).fill(0);
    for (const d of descriptors) {
      for (let i = 0; i < FACE_DESCRIPTOR_LENGTH; i++) {
        summed[i] += d.values[i];
      }
    }
    const avg = summed.map((v) => v / descriptors.length);
    return FaceDescriptor.create(avg);
  }

  toArray(): number[] {
    return [...this.values];
  }
}