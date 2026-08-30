import { Check, ChevronsUpDown, X } from "lucide-react";
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

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  field: ControllerRenderProps;
  options: Option[];
  input: IFormInput;
  label?: boolean;
}

const MultiSelectFormItem: React.FC<MultiSelectProps> = ({
  field,
  options,
  input,
  label,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredOptions = useMemo<Option[]>(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const handleSelect = (value: string) => {
    const currentValues: string[] = Array.isArray(field.value)
      ? field.value
      : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((val) => val !== value)
      : [...currentValues, value];

    field.onChange(newValues);
  };

  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-medium font-sora">
          {input.label}
        </FormLabel>
      )}

      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              id={input.name}
              role="combobox"
              aria-expanded={open}
              className="whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 px-4 py-2 has-[>svg]:px-3 relative border-muted w-full min-h-12 !h-auto text-black-blue overflow-hidden border-none bg-white hover:bg-white font-sora flex justify-start items-center flex-wrap gap-1 !pr-8 capitalize"
            >
              {field.value && field.value.length > 0
                ? field.value.map((val: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[13px] font-sora text-[#0AB79B] px-2 py-1 rounded-full bg-[#C2ECE5] flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(val);
                      }}
                    >
                      {options.find((option) => option.value === val)?.label}
                      <X size={14} className="text-[#2F927E]" />
                    </span>
                  ))
                : `Choose ${input.label}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute top-1/2 -translate-y-1/2 right-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            id={input.name}
            className="w-[300px] sm:w-[400px] md:w-[370px] xl:w-[420px] p-0 z-[1000] border-none"
          >
            <Command id={input.name} className="text-black-blue">
              <CommandInput
                placeholder="Search..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList id={input.name}>
                <CommandEmpty>No options found</CommandEmpty>
                <CommandGroup id={input.name}>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      className="py-2.5 cursor-pointer text-sm text-black-blue hover:bg-blue-200/20 font-sora capitalize"
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
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
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default MultiSelectFormItem;
