import { FormField } from "@/components/ui/form";
import { IFormInput } from "@/interfaces";
import InputFormItem from "../formItems/InputFormItem";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { z, ZodSchema } from "zod";

interface IProps {
  input: IFormInput;
  form: UseFormReturn<any>;
  schema: ZodSchema;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RenderLessonFormItems = ({ input, form, schema }: IProps) => {
  const renderField = ({ field }: { field: ControllerRenderProps }) => {
    return <InputFormItem input={input} field={field} label />;
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

export default RenderLessonFormItems;
