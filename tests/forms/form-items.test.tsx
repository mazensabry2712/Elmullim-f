import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import MultiSelectFormItem from "@/components/forms/formItems/MultiSelectFormItem";

const selectInput = {
  name: "country_id",
  label: "Country Name",
  type: "select",
};

const renderSelect = (language: "en" | "ar" = "en") => {
  const Wrapper = () => {
    const form = useForm<{ country_id: string; subjects: string[] }>({
      defaultValues: { country_id: "", subjects: [] },
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
              input={selectInput}
              label
            />
          )}
        />
      </Form>
    );
  };

  if (language === "en") {
    return render(<Wrapper />);
  }

  return render(
    <Wrapper />
  );
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

    const popover = document.querySelector("[data-radix-popper-content-wrapper]");
    expect(popover).not.toBeNull();
    expect(popover?.querySelector('[role="dialog"]')).not.toBeNull();
    expect(
      popover?.firstElementChild?.className.toString()
    ).toContain("w-[calc(100vw-2rem)]");
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

    render(<Wrapper />);

    const trigger = screen.getByRole("combobox", { name: "Subjects" });
    expect(trigger).toHaveAttribute("type", "button");

    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText("Choose...")).toBeInTheDocument();
    expect(screen.getByText("Not found")).toBeInTheDocument();
  });
});
