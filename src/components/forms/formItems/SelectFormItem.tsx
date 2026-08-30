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

interface IProps {
  field: ControllerRenderProps<any>;
  options: { value: string; label: string }[];
  input: IFormInput;
  label?: boolean;
}

const SelectFormItem = ({ field, options, input, label }: IProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.value.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-sora font-medium">
          {input.label}
        </FormLabel>
      )}
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <button
              id={input.name}
              role="combobox"
              aria-expanded={open}
              className="border border-input inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] px-4 py-2 has-[>svg]:px-3 w-full !h-12 text-black-blue justify-between overflow-hidden bg-white hover:bg-white font-sora capitalize"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen(!open);
              }}
            >
              {field.value
                ? options.find((option) => option.value === field.value)
                    ?.label || `Choose ${input.label}...`
                : `Choose ${input.label}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] sm:w-[400px] md:w-[370px] xl:w-[420px] p-0 z-[1000] border-none"
            onWheel={(e) => e.stopPropagation()}
          >
            <Command className="text-black-blue">
              <CommandInput
                placeholder="choose..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList
                className="max-h-[300px] overflow-y-auto"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                }}
              >
                <CommandEmpty>Not found</CommandEmpty>
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
                          field.value === option.value
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

export default SelectFormItem;
