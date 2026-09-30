import { describe, expect, it } from "vitest";
import { studentSignUpSchema } from "@/validations/auth";

const validStudent = {
  name: "New Student",
  email: "new-student@example.test",
  password: "Student@12345",
  gender: "male",
  phone: "201001234567",
  country_id: "1",
  education_system_id: "2",
  education_level_id: "3",
};

describe("studentSignUpSchema", () => {
  it("accepts a complete API-compatible payload", () => {
    expect(studentSignUpSchema.safeParse(validStudent).success).toBe(true);
  });

  it("rejects passwords shorter than the backend minimum", () => {
    expect(
      studentSignUpSchema.safeParse({
        ...validStudent,
        password: "1234567",
      }).success
    ).toBe(false);
  });

  it("rejects invalid gender, phone, and education identifiers", () => {
    const result = studentSignUpSchema.safeParse({
      ...validStudent,
      gender: "other",
      phone: "20-100",
      country_id: "egypt",
      education_system_id: "system",
      education_level_id: "level",
    });

    expect(result.success).toBe(false);
  });

  it("does not require a location during registration", () => {
    expect(studentSignUpSchema.safeParse(validStudent).success).toBe(true);
  });
});
