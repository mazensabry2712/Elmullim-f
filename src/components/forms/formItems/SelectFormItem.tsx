import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IFormInput } from "@/interfaces";
import { useMemo, useState } from "react";
import { useI18n } from "@/i18n";
import { translateFormText } from "@/i18n/formCopy";

interface IProps {
  field: ControllerRenderProps<any>;
  options: { value: string; label: string }[];
  input: IFormInput;
  label?: boolean;
}

const SelectFormItem = ({ field, options, input, label }: IProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { language } = useI18n();
  const translatedLabel = translateFormText(language, input.label) ?? input.label ?? "";

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    const query = searchValue.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
    );
  }, [options, searchValue]);

  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-sora font-medium">
          {translatedLabel}
        </FormLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <FormControl>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              className="border border-input inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] px-4 py-2 has-[>svg]:px-3 w-full !h-12 text-black-blue justify-between overflow-hidden bg-white hover:bg-white font-sora capitalize"
            >
              {field.value
                ? options.find((option) => option.value === field.value)?.label || `${translateFormText(language, "Choose")} ${translatedLabel}...`
                : `${translateFormText(language, "Choose")} ${translatedLabel}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent
          className="w-[calc(100vw-2rem)] max-w-[420px] p-0 z-[1000] border-none sm:w-[min(400px,calc(100vw-2rem))] md:w-[min(370px,calc(100vw-2rem))] xl:w-[min(420px,calc(100vw-2rem))]"
          onWheel={(e) => e.stopPropagation()}
        >
            <Command shouldFilter={false} className="text-black-blue">
              <CommandInput
                placeholder={translateFormText(language, "choose")}
                value={searchValue}
                onValueChange={setSearchValue}
                className="bg-white text-black placeholder:text-black/50 focus-visible:ring-0"
              />
              <CommandList
                className="max-h-[300px] overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <CommandEmpty>{translateFormText(language, "Not found")}</CommandEmpty>
                <CommandGroup>
                  {filteredOptions?.map((option, idx) => (
                    <CommandItem
                      className="py-2.5 cursor-pointer text-sm text-black-blue hover:bg-blue-200/20 font-sora capitalize"
                      key={idx}
                      id={input.name}
                      {...field}
                      value={option.value}
                      onSelect={() => {
                        field.onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default SelectFormItem;
