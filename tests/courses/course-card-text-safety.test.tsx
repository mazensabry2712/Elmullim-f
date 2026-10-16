import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import CourseCard from "@/components/courses/CourseCard";
import type { ICourse } from "@/interfaces/courses/courses";
import { getCoursesCopy } from "@/pages/courses/courseCopy";

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: { auth: { isAuthenticated: boolean } }) => unknown) =>
    selector({ auth: { isAuthenticated: false } }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getRole: () => null },
}));

describe("Public course card text safety", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("replaces technical errors and repeated placeholder text with localized safe labels", () => {
    const course = {
      id: 13,
      title: "Request failed with status code 500",
      description: "الحنكليس الحنكليس الحنكليس",
      price: 0,
      level: "expert",
      image: "",
      hasEnrolled: false,
      teacher: { id: 6, name: "Teacher One", profile_image: null },
      sub_category: { id: 2, name: "Category", category: { id: 1, name: "Category" } },
    } as unknown as ICourse;

    render(
      <MemoryRouter>
        <I18nProvider>
          <CourseCard course={course} copy={getCoursesCopy("en")} />
        </I18nProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Course title under review", level: 4 })).toBeInTheDocument();
    expect(screen.getByText("Description under review")).toBeInTheDocument();
    expect(screen.queryByText("Request failed with status code 500")).not.toBeInTheDocument();
    expect(screen.queryByText("الحنكليس الحنكليس الحنكليس")).not.toBeInTheDocument();
  });
});
