import { FormField } from "@/components/ui/form";
import { IFormInput } from "@/interfaces";
import { z, ZodSchema } from "zod";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { GENDERS } from "@/constant";
import MultiInputForm from "../formItems/MultiInputForm";
import MultiSelectFormItem from "../formItems/MultiSelectFormItem";
import SelectFormItem from "../formItems/SelectFormItem";
import InputFormItem from "../formItems/InputFormItem";

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
const RenderSignUpFormFields = ({ input, form, schema, options }: IProps) => {
  const renderField = ({ field }: { field: ControllerRenderProps }) => {
    switch (true) {
      case input.name === "students":
        return <MultiInputForm input={input} field={field} form={form} />;

      case input.name === "course_type":
        return (
          <MultiSelectFormItem
            field={field}
            input={input}
            options={options?.coursesType || []}
          />
        );

      case input.name === "subjects":
        return (
          <MultiSelectFormItem
            field={field}
            input={input}
            options={options?.subjects || []}
          />
        );

      case input.name === "education_level_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.educationLevels || []}
          />
        );

      case input.name === "country_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.countries || []}
          />
        );

      case input.name === "education_system_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.educationSystems || []}
          />
        );

      case input.name === "gender":
        return <SelectFormItem field={field} input={input} options={GENDERS} />;

      default:
        return <InputFormItem input={input} field={field} />;
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

export default RenderSignUpFormFields;
