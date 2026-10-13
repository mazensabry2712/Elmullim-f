import { describe, expect, it } from "vitest";
import { courseContentSchema, courseLectureSchema, courseSchema } from "@/validations/teacher/courseSchema";
const validDescription = "Learn the core ideas through examples and guided practice.";

describe("teacher course authoring validation", () => {
  it("accepts clear course, content and lecture text", () => {
    expect(courseSchema.safeParse({title:"Physics Fundamentals",description:validDescription,price:100,level:"beginner",sub_category_id:"1",category_id:"1"}).success).toBe(true);
    expect(courseContentSchema.safeParse({title:"Introduction",description:"This section explains the main concepts in detail.",courseId:"1"}).success).toBe(true);
    expect(courseLectureSchema.safeParse({title:"Forces and Motion",description:"This lecture introduces the basic rules of motion.",courseId:"1",contentId:"1"}).success).toBe(true);
  });
  it("rejects repetitive placeholder text", () => {
    expect(courseSchema.safeParse({title:"ؤؤصيؤصؤسيؤسصؤسصثبؤسصثي",description:validDescription,price:100,level:"beginner",sub_category_id:"1",category_id:"1"}).success).toBe(false);
    expect(courseContentSchema.safeParse({title:"قثبقثبثقبقثبقثبقثب",description:"fdfdgfdgfdgfdgfdgfdgfdgdfgfdgfdgfdgfdg",courseId:"1"}).success).toBe(false);
  });
});
