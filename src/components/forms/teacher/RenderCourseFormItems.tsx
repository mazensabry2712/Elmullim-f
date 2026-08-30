import { FormField } from "@/components/ui/form";
import { IFormInput } from "@/interfaces";
import SelectFormItem from "../formItems/SelectFormItem";
import InputFormItem from "../formItems/InputFormItem";
import { COURSE_LEVELS } from "@/constant";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { z, ZodSchema } from "zod";

interface IOption {
  value: string;
  label: string;
}

interface IProps {
  input: IFormInput;
  form: UseFormReturn<any>;
  options?: {
    [key: string]: IOption[];
  };
  schema: ZodSchema;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RenderCourseFormItems = ({ input, form, schema, options }: IProps) => {
  const renderField = ({ field }: { field: ControllerRenderProps }) => {
    switch (true) {
      case input.name === "sub_category_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.subCategories || []}
            label
          />
        );

      case input.name === "category_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.categories || []}
            label
          />
        );

      case input.name === "level":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={COURSE_LEVELS}
            label
          />
        );

      default:
        return <InputFormItem input={input} field={field} label />;
    }
  };

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name as keyof z.infer<typeof schema> as string}
      render={renderField}
    />
  );
};

export default RenderCourseFormItems;
