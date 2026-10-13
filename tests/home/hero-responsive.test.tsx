import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Hero from "@/components/home/hero/Hero";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      id,
    }: {
      children?: React.ReactNode;
      className?: string;
      id?: string;
    }) => (
      <div id={id} className={className}>
        {children}
      </div>
    ),
    h1: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <h1 className={className}>{children}</h1>
    ),
    img: ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img className={className} {...props} />
    ),
  },
}));

vi.mock("@/constant", () => ({
  BENEFITS: [
    { title: "Secured Payment", description: "Protected payments" },
    { title: "Rating for Teachers & Students", description: "Transparent ratings" },
  ],
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/hero/BenefitCard", () => ({
  default: ({ benefit }: { benefit: { title: string } }) => <div>{benefit.title}</div>,
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("Home hero responsive layout", () => {
  it("uses viewport-safe responsive layout classes", () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const section = container.querySelector("section");
    const heading = container.querySelector("h1");
    const benefitsGrid = container.querySelector("#home-hero-benefits");
    const image = container.querySelector('img[alt="home.hero.imageAlt"]');
    const cap = container.querySelector('img[src="/icons/cap-icon.svg"]');

    expect(section).toHaveClass("overflow-hidden");
    expect(heading).toHaveClass("text-[clamp(2rem,6vw,3.5rem)]");
    expect(heading).toHaveClass("leading-[1.1]");
    expect(benefitsGrid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-4");
    expect(image).toHaveClass("w-full", "max-w-[30rem]");
    expect(cap).toHaveClass("left-0", "w-10", "sm:w-auto", "xl:-left-8");
  });

  it("provides working primary and secondary navigation links", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "home.hero.cta.lessons" })).toHaveAttribute(
      "href",
      "/lessons"
    );
    expect(screen.getByRole("link", { name: "home.hero.cta.teachers" })).toHaveAttribute(
      "href",
      "/teachers"
    );
  });
});
