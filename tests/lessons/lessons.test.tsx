import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import Lessons from "@/pages/lessons/Lessons";
import { I18nProvider, useI18n } from "@/i18n";

const {
  mockRefetch,
  mockUseGetLessons,
  mockUseGetLessonFilterOptions,
  mockUseGetStudentProfile,
  mockUseGetParentProfile,
  mockGetToken,
  mockGetRole,
} = vi.hoisted(() => ({
  mockRefetch: vi.fn(),
  mockUseGetLessons: vi.fn(),
  mockUseGetLessonFilterOptions: vi.fn(),
  mockUseGetStudentProfile: vi.fn(),
  mockUseGetParentProfile: vi.fn(),
  mockGetToken: vi.fn(() => undefined),
  mockGetRole: vi.fn(() => undefined),
}));

vi.mock("@/lib/react-query/lessons/lessons", () => ({
  useGetLessons: (...args: unknown[]) => mockUseGetLessons(...args),
  useGetLessonFilterOptions: () => mockUseGetLessonFilterOptions(),
}));

vi.mock("@/lib/react-query/student/studentProfile", () => ({
  useGetStudentProfile: (...args: unknown[]) => mockUseGetStudentProfile(...args),
}));

vi.mock("@/lib/react-query/parent/parentProfile", () => ({
  useGetParentProfile: (...args: unknown[]) => mockUseGetParentProfile(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: mockGetToken, getRole: mockGetRole },
}));

vi.mock("@/components/lessons/LessonsList", () => ({
  default: ({ lessons, copy }: { lessons: Array<{ title: string }>; copy: { empty: string } }) =>
    lessons.length ? (
      <div data-testid="lessons-list">{lessons.map((lesson) => <span key={lesson.title}>{lesson.title}</span>)}</div>
    ) : (
      <p>{copy.empty}</p>
    ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
};

const renderPage = (children: React.ReactNode) =>
  render(
    <MemoryRouter>
      <I18nProvider>{children}</I18nProvider>
    </MemoryRouter>
  );

describe("Lessons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetToken.mockReturnValue(undefined);
    mockGetRole.mockReturnValue(undefined);
    mockUseGetStudentProfile.mockReturnValue({ data: undefined });
    mockUseGetParentProfile.mockReturnValue({ data: undefined });
    mockUseGetLessonFilterOptions.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: {
          education_levels: [
            { id: 1, name: "Secondary" },
            { id: 2, name: "Primary" },
          ],
          subjects: [
            { id: 11, name: "Mathematics", education_level: { id: 1, name: "Secondary" } },
            { id: 12, name: "Physics", education_level: { id: 2, name: "Primary" } },
          ],
          grades: ["Grade 10", "Grade 12"],
          service_areas: [
            { id: 101, name: "Cairo" },
            { id: 102, name: "Damanhur" },
          ],
        },
      },
    });

    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders API lessons and an accessible search field", () => {
    mockUseGetLessons.mockReturnValue({
      data: { data: [{ id: 1, title: "Algebra Basics" }] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    expect(screen.getByRole("heading", { name: /lessons/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search lessons/i })).toBeInTheDocument();
    expect(screen.getByTestId("lessons-list")).toHaveTextContent("Algebra Basics");
  });

  it("renders stage and subject discovery filters", () => {
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    expect(screen.getByRole("combobox", { name: "Education stage" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Secondary" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Subject" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mathematics" })).toBeInTheDocument();
  });

  it("cascades subjects when an education stage is selected", async () => {
    const user = userEvent.setup();
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    const stage = screen.getByRole("combobox", { name: "Education stage" });
    const subject = screen.getByRole("combobox", { name: "Subject" });

    await user.selectOptions(stage, "1");

    expect(screen.getByRole("option", { name: "Mathematics" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Physics" })).not.toBeInTheDocument();
    expect(subject).toHaveValue("");
  });

  it("supports real service areas and sorting controls", async () => {
    const user = userEvent.setup();
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    const delivery = screen.getByRole("combobox", { name: "Delivery" });
    await user.selectOptions(delivery, "offline");

    const serviceArea = screen.getByRole("combobox", { name: "Service area" });
    await user.selectOptions(serviceArea, "101");

    const sort = screen.getByRole("combobox", { name: "Sort by" });
    await user.selectOptions(sort, "price_asc");

    expect(screen.getByRole("option", { name: "Cairo" })).toBeInTheDocument();
    const latestCall = mockUseGetLessons.mock.calls.at(-1)?.[0] as Record<string, unknown>;

    expect(latestCall).toMatchObject({
      delivery_mode: "offline",
      service_area_id: 101,
      sort: "price_asc",
    });
  });


  it("uses the student's saved location for smart nearby discovery", async () => {
    const user = userEvent.setup();
    mockGetToken.mockReturnValue("student-token");
    mockGetRole.mockReturnValue("student");
    mockUseGetStudentProfile.mockReturnValue({
      data: {
        data: {
          address: "Damanhur, Beheira",
          latitude: 31.04,
          longitude: 30.47,
        },
      },
    });
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    await user.click(screen.getByRole("button", { name: /near my saved location/i }));

    const latestCall = mockUseGetLessons.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(latestCall).toMatchObject({
      nearby: true,
      delivery_mode: "offline",
      enabled: true,
    });
  });

  it("lets a parent choose the beneficiary student for smart nearby discovery", async () => {
    const user = userEvent.setup();
    mockGetToken.mockReturnValue("parent-token");
    mockGetRole.mockReturnValue("parent");
    mockUseGetParentProfile.mockReturnValue({
      data: {
        data: {
          students: [
            { id: 201, name: "Sara", address: "Damanhur", latitude: 31.04, longitude: 30.47 },
            { id: 202, name: "Omar", address: "Alexandria", latitude: 31.2, longitude: 29.9 },
          ],
        },
      },
    });
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Choose student" }), "201");
    await user.click(screen.getByRole("button", { name: /near my saved location/i }));

    const latestCall = mockUseGetLessons.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(latestCall).toMatchObject({
      nearby: true,
      student_id: 201,
      delivery_mode: "offline",
      enabled: true,
    });
  });

  it("renders a retryable error state", async () => {
    const user = userEvent.setup();
    mockUseGetLessons.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    renderPage(<Lessons />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("preserves existing discovery filters while changing search", async () => {
    const user = userEvent.setup();
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter initialEntries={["/lessons?delivery_mode=offline&subject_id=11"]}>
        <I18nProvider>
          <Lessons />
          <LocationProbe />
        </I18nProvider>
      </MemoryRouter>
    );

    const search = screen.getByRole("searchbox", { name: /search lessons/i });
    await user.type(search, "math");

    const currentSearch = screen.getByTestId("location-search").textContent ?? "";
    expect(currentSearch).toContain("delivery_mode=offline");
    expect(currentSearch).toContain("subject_id=11");
    expect(currentSearch).toContain("q=math");
  });

  it("removes offline location when switching discovery to online", async () => {
    const user = userEvent.setup();
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter initialEntries={["/lessons?delivery_mode=offline&location=Cairo"]}>
        <I18nProvider>
          <Lessons />
          <LocationProbe />
        </I18nProvider>
      </MemoryRouter>
    );

    const delivery = screen.getByRole("combobox", { name: "Delivery" });
    await user.selectOptions(delivery, "online");

    const currentSearch = screen.getByTestId("location-search").textContent ?? "";
    expect(currentSearch).toContain("delivery_mode=online");
    expect(currentSearch).not.toContain("location=Cairo");
  });

  it("supports Arabic and RTL", async () => {
    const user = userEvent.setup();
    mockUseGetLessons.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(
      <>
        <Lessons />
        <LanguageToggle />
      </>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /الدروس/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/لم يتم العثور على دروس/i)).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
