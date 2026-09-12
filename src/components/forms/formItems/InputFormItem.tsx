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

  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-medium font-sora">
          {translateFormText(language, input.label)}
        </FormLabel>
      )}

      <FormControl>
        <Input
          type={input.type}
          placeholder={translateFormText(language, input.placeholder)}
          autoComplete={"on"}
          {...field}
          min={0}
          className="bg-white py-6 text-black-blue border-input focus-visible:ring-0 placeholder:text-black-blue/50 placeholder:text-sm placeholder:font-sora"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default InputFormItem;
