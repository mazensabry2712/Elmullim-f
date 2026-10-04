import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import MultiSelectFormItem from "@/components/forms/formItems/MultiSelectFormItem";
import { I18nProvider } from "@/i18n";

vi.mock("@/components/ui/popover", async () => {
  const React = await import("react");

  type PopoverContextValue = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };

  const PopoverContext = React.createContext<PopoverContextValue | null>(null);

  const Popover = ({
    open = false,
    onOpenChange = () => undefined,
    children,
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }) => (
    <PopoverContext.Provider value={{ open, onOpenChange }}>
      {children}
    </PopoverContext.Provider>
  );

  const PopoverTrigger = ({
    asChild,
    children,
    ...props
  }: {
    asChild?: boolean;
    children?: React.ReactElement<Record<string, any>>;
    [key: string]: any;
  }) => {
    const context = React.useContext(PopoverContext);
    if (!asChild || !React.isValidElement(children)) {
      return children ?? null;
    }

    const child = children as React.ReactElement<Record<string, any>>;
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event);
        context?.onOpenChange(!context.open);
      },
    });
  };

  const PopoverContent = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: any;
  }) => {
    const context = React.useContext(PopoverContext);
    if (!context?.open) return null;
    return <div {...props}>{children}</div>;
  };

  const PopoverAnchor = ({ children }: { children?: React.ReactNode }) =>
    children ?? null;

  return { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
});

const renderWithProviders = (children: React.ReactNode) =>
  render(<I18nProvider>{children}</I18nProvider>);

const renderSelect = () => {
  const Wrapper = () => {
    const form = useForm<{ country_id: string }>({
      defaultValues: { country_id: "" },
    });

    return (
      <Form {...form}>
        <FormField
          control={form.control}
          name="country_id"
          render={({ field }) => (
            <SelectFormItem
              field={field}
              options={[
                { value: "eg", label: "Egypt" },
                { value: "sa", label: "Saudi Arabia" },
              ]}
              input={{
                name: "country_id",
                label: "Country Name",
                type: "select",
              }}
              label
            />
          )}
        />
      </Form>
    );
  };

  renderWithProviders(<Wrapper />);
};

describe("form item controls", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
  });
  it("keeps select triggers from submitting their parent form", () => {
    renderSelect();

    const trigger = screen.getByRole("combobox", { name: "Country Name" });
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveAttribute("aria-invalid", "false");
  });

  it("constrains select popovers to the viewport on small screens", () => {
    renderSelect();

    fireEvent.click(screen.getByRole("combobox", { name: "Country Name" }));

    const searchInput = screen.getByPlaceholderText("Choose...");
    expect(searchInput.parentElement?.parentElement?.parentElement?.className.toString()).toContain(
      "w-[calc(100vw-2rem)]"
    );

    fireEvent.change(searchInput, { target: { value: "Egypt" } });
    expect(screen.getByText("Egypt")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Country Name" }));
  });

  it("keeps multiselect trigger safe and localizes its search copy", () => {
    const Wrapper = () => {
      const form = useForm<{ subjects: string[] }>({
        defaultValues: { subjects: [] },
      });

      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <MultiSelectFormItem
                field={field}
                options={[
                  { value: "math", label: "Mathematics" },
                  { value: "science", label: "Science" },
                ]}
                input={{
                  name: "subjects",
                  label: "Subjects",
                  type: "multi-select",
                }}
                label
              />
            )}
          />
        </Form>
      );
    };

    renderWithProviders(<Wrapper />);

    const trigger = screen.getByRole("combobox", { name: "Subjects" });
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveAttribute("aria-invalid", "false");

    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Choose...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "does-not-exist" } });
    expect(screen.getByText("Not found")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Subjects" }));
  }, 15000);
});
