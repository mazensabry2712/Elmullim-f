import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TeacherDetails from "@/pages/teachers/TeacherDetails";

const mockData = vi.hoisted(() => ({
  teacherQuery: {
    data: {
      status: true,
      message: null,
      data: {
        id: 6,
        name: "Mona Hassan",
        description: "An experienced teacher who explains mathematics clearly and patiently.",
        experince: 8,
        qualification: "Bachelor of Education",
        profile_image: "",
        education_level: {
          id: 20,
          name: "Secondary Education",
          description: "Secondary grades",
          education_system: {
            id: 5,
            name: "National Education System",
            country: { id: 1, name: "Egypt", code: "+20" },
          },
        },
        course_types: ["online", "private"],
        gender: "female",
        rating: 4.5,
        rating_count: 3,
        courses_count: 1,
        lessons_count: 1,
        subjects: [{ id: 20, name: "Mathematics" }],
      },
    },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  },
  coursesQuery: {
    data: {
      status: true,
      message: null,
      data: [
        {
          id: 31,
          title: "Algebra Foundations",
          description: "Learn algebra step by step with clear examples and practice.",
          image: "",
          level: "beginner",
          price: "100",
          sub_category: {
            id: 4,
            name: "Mathematics",
            description: "",
            image: null,
            category: { id: 2, name: "School", description: "", image: null },
          },
          teacher: { id: 6, name: "Mona Hassan", profile_image: "" },
          hasEnrolled: null,
        },
      ],
    },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  },
  lessonsQuery: {
    data: {
      status: true,
      message: null,
      data: [
        {
          id: 41,
          title: "Private Mathematics Lesson",
          description: "Personal mathematics instruction and guided exercises.",
          logo: "",
          teacher: { id: 6, name: "Mona Hassan", profile_image: "" },
          subject_id: 20,
          subject_name: "Mathematics",
          education_level_id: 20,
          education_level_name: "Secondary Education",
          grade: "11",
          rating_average: 4.8,
          rating_count: 2,
          price: "200",
          delivery_mode: "online",
          booking_type: "private",
          duration_minutes: 45,
          sessions_count: 1,
          availability: [],
          service_areas: [],
          max_students: null,
          publishing_status: "published",
          operational_status: "available",
          is_bookable: true,
          created_at: "2026-10-01T00:00:00.000Z",
          updated_at: "2026-10-01T00:00:00.000Z",
        },
      ],
    },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: { queryKey?: unknown[] }) => {
    const section = options.queryKey?.[1];
    if (section === "details") return mockData.teacherQuery;
    if (section === "courses") return mockData.coursesQuery;
    return mockData.lessonsQuery;
  },
}));

vi.mock("@/services/main", () => ({
  getTeacherDetails: vi.fn(),
  getPublicTeacherCourses: vi.fn(),
  getPublicTeacherLessons: vi.fn(),
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language: "en" }),
}));

describe("Public teacher profile", () => {
  it("shows the teacher's public details, specialties, published courses, and lessons", () => {
    render(
      <MemoryRouter initialEntries={["/teachers/6"]}>
        <Routes>
          <Route path="/teachers/:teacherId" element={<TeacherDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Mona Hassan" })).toBeInTheDocument();
    expect(screen.getByText("Bachelor of Education")).toBeInTheDocument();
    expect(screen.getByText("An experienced teacher who explains mathematics clearly and patiently.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mathematics" })).toHaveAttribute("href", "/teachers?subject_id=20");
    expect(screen.getByRole("heading", { name: "Algebra Foundations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Private Mathematics Lesson" })).toBeInTheDocument();
    expect(screen.getByText("Egypt")).toBeInTheDocument();
  });

  it("keeps phone and email out of the public profile", () => {
    render(
      <MemoryRouter initialEntries={["/teachers/6"]}>
        <Routes>
          <Route path="/teachers/:teacherId" element={<TeacherDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("01000009999")).not.toBeInTheDocument();
    expect(screen.queryByText("mona@example.test")).not.toBeInTheDocument();
  });
});
