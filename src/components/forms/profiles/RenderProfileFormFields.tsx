import { FormField } from "@/components/ui/form";
import { IFormInput } from "@/interfaces";
import { z, ZodSchema } from "zod";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { GENDERS } from "@/constant";
import { useUploadFileHandler } from "@/hooks/useUploadFileHandler";
import { ACCEPTED_CV_TYPES, ACCEPTED_IMAGE_TYPES } from "@/utils/file";
import MultiSelectFormItem from "../formItems/MultiSelectFormItem";
import SelectFormItem from "../formItems/SelectFormItem";
import FileFormItem from "../formItems/FileFormItem";
import MultiInputForm from "../formItems/MultiInputForm";
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

const RenderProfileFormFields = ({
  input,
  form,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schema,
  options,
}: IProps) => {
  const { handleFileChange: handleCVFileChange } = useUploadFileHandler(
    form,
    ACCEPTED_CV_TYPES
  );
  const { handleFileChange: handleImgFileChange } = useUploadFileHandler(
    form,
    ACCEPTED_IMAGE_TYPES
  );

  const renderField = ({ field }: { field: ControllerRenderProps }) => {
    switch (true) {
      case input.name === "subjects" || input.name === "favourite_subjects":
        return (
          <MultiSelectFormItem
            field={field}
            input={input}
            options={options?.subjects || []}
            label
          />
        );

      case input.name === "education_level_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.educationLevels || []}
            label
          />
        );

      case input.name === "education_system_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.educationSystems || []}
            label
          />
        );

      case input.name === "cv":
        return (
          <FileFormItem
            field={field}
            input={input}
            handleFileChange={handleCVFileChange}
            label
          />
        );

      case input.name === "profile_image":
        return (
          <FileFormItem
            field={field}
            input={input}
            handleFileChange={handleImgFileChange}
            label
          />
        );

      case input.name === "country_id":
        return (
          <SelectFormItem
            field={field}
            input={input}
            options={options?.countries || []}
            label
          />
        );

      case input.name === "gender":
        return <SelectFormItem field={field} input={input} options={GENDERS} />;

      case input.name === "students":
        return <MultiInputForm input={input} field={field} form={form} label />;

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

export default RenderProfileFormFields;
