import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import MultiSelectFormItem from "@/components/forms/formItems/MultiSelectFormItem";
import { I18nProvider } from "@/i18n";

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
  it("keeps select triggers from submitting their parent form", () => {
    renderSelect();

    const trigger = screen.getByRole("combobox", { name: "Country Name" });
    expect(trigger).toHaveAttribute("type", "button");
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

    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Choose...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "does-not-exist" } });
    expect(screen.getByText("Not found")).toBeInTheDocument();
  });
});
