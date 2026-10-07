import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IFormInput } from "@/interfaces";
import { ControllerRenderProps } from "react-hook-form";
import { useI18n } from "@/i18n";
import { translateFormText } from "@/i18n/formCopy";

interface IProps {
  field: ControllerRenderProps<any, any>;
  input: IFormInput;
  label?: boolean;
}

const InputFormItem = ({ input, field, label = false }: IProps) => {
  const { language } = useI18n();

  const inputType = input.name === "email"
    ? "email"
    : input.name === "phone"
      ? "tel"
      : input.type;

  const autoComplete =
    input.name === "name"
      ? "name"
      : input.name === "email"
        ? "email"
        : input.name === "password"
          ? "new-password"
          : input.name === "phone"
            ? "tel"
            : "off";

  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-medium font-sora">
          {translateFormText(language, input.label)}
        </FormLabel>
      )}

      <FormControl>
        <Input
          type={inputType}
          placeholder={translateFormText(language, input.placeholder)}
          autoComplete={autoComplete}
          {...field}
          min={0}
          className="bg-white !text-[#21374B] py-6 border border-[#E5ECEA] focus-visible:ring-0 focus-visible:border-[#0AB99D] placeholder:!text-[#21374B]/50 placeholder:text-sm placeholder:font-sora"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default InputFormItem;
