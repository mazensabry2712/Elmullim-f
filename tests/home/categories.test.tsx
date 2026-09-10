import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import Categories from "@/components/home/categories/Categories";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/categories/CategoryCard", () => ({
  default: ({ title }: { title: string }) => <article>{title}</article>,
}));

describe("Home categories", () => {
  it("renders the categories section with all configured categories", () => {
    render(<Categories />);

    expect(
      screen.getByRole("heading", { name: /browse by categories/i })
    ).toBeInTheDocument();

    for (const category of [
      "Physics",
      "Maths",
      "Languages",
      "History",
      "Geography",
      "Chemistry",
      "Biology",
      "philosophy and Logic",
    ]) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });
});
