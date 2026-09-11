import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import Hero from "@/components/home/hero/Hero";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
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
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    const heading = container.querySelector("h1");
    const benefitsGrid = container.querySelector(".grid");
    const image = container.querySelector('img[alt="home.hero.imageAlt"]');
    const cap = container.querySelector('img[alt="home.hero.capAlt"]');

    expect(section).toHaveClass("overflow-hidden");
    expect(heading).toHaveClass("text-[clamp(2rem,8vw,2.8125rem)]");
    expect(heading).toHaveClass("leading-[1.1]");
    expect(benefitsGrid).toHaveClass("w-full", "grid-cols-1", "sm:grid-cols-2");
    expect(image).toHaveClass("w-full", "max-w-[30rem]");
    expect(cap).toHaveClass("left-0", "w-10", "sm:w-auto", "xl:-left-8");
  });
});
