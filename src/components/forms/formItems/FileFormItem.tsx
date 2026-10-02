import { IFormInput } from "@/interfaces";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { ChangeEvent } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import truncateTxt from "@/utils/truncateTxt";
import { useI18n } from "@/i18n";
import { translateFormText } from "@/i18n/formCopy";

interface IProps {
  field: ControllerRenderProps<FieldValues, string>;
  input: IFormInput;
  handleFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: File) => void
  ) => void;
  label?: boolean;
}
const FileFormItem = ({ input, field, handleFileChange, label }: IProps) => {
  const { language } = useI18n();

  return (
    <FormItem className="min-w-0">
      {label && (
        <FormLabel className="font-sora font-medium text-black-blue">
          {translateFormText(language, input.label)}
        </FormLabel>
      )}

      <FormControl>
        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-100 bg-white p-2">
          <label
            htmlFor={input.name}
            className="w-full max-w-36 shrink-0 cursor-pointer rounded-md bg-main px-2 py-2 text-center text-sm font-semibold text-white transition hover:bg-main/90"
          >
            {translateFormText(language, input.label) ||
              (language === "ar" ? "اختيار ملف" : "Choose file")}
          </label>
          <span
            className="min-w-0 flex-1 truncate text-start font-sora text-xs text-gray-700"
            title={field.value?.name}
          >
            {truncateTxt(field.value?.name, 24) ||
              (language === "ar" ? "لم يتم اختيار ملف" : "No file chosen")}
          </span>
          <Input
            id={input.name}
            type="file"
            accept={input.accept}
            {...field}
            onChange={(e) => handleFileChange(e, field.onChange)}
            value={undefined}
            className="hidden"
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FileFormItem;
