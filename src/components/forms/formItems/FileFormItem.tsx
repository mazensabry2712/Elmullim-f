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
  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-medium font-sora">
          {input.label}
        </FormLabel>
      )}

      <FormControl>
        <div className="flex items-center gap-4 bg-white rounded-md py-2 px-2">
          <label
            htmlFor={input.name}
            className="text-sm bg-main text-white rounded-md cursor-pointer hover:bg-main/90 px-2 py-1.5 w-full max-w-36 text-center"
          >
            {input.label}
          </label>
          <span className="text-gray-700 text-sm">
            {truncateTxt(field.value?.name, 18) || "No file chosen"}
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
