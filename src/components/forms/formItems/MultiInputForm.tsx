import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { IFormInput } from "@/interfaces";

interface IProps {
  field: ControllerRenderProps<FieldValues, string>;
  input: IFormInput;
  form: UseFormReturn;
  label?: boolean;
}

const MultiInputForm = ({ form, input, label }: IProps) => {
  const watchedTags = form.watch(input.name);
  const tags: string[] = Array.isArray(watchedTags) ? watchedTags : [];

  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    const value = newTag.trim();
    if (value && !tags.includes(value)) {
      form.setValue(input.name, [...tags, value]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    form.setValue(input.name, updatedTags);
  };

  const renderErrorMessages = (error: any) => {
    if (Array.isArray(error)) {
      return error.map((err, index) =>
        err ? (
          <p key={index} className="text-[0.8rem] font-medium text-destructive">
            {err.message}
          </p>
        ) : null
      );
    }
    if (error) {
      return (
        <p className="text-[0.8rem] font-medium text-destructive">
          {error.message}
        </p>
      );
    }
    return null;
  };
  return (
    <FormItem>
      {label && (
        <FormLabel className="text-black-blue font-medium font-sora">
          {input.label}
        </FormLabel>
      )}

      <FormControl>
        <div>
          <div
            className={`${
              tags.length ? "flex" : "hidden"
            } flex-wrap gap-2 mb-2`}
          >
            {tags.map((tag, index) => (
              <Badge
                key={index}
                className="flex items-center gap-2 bg-main hover:bg-main/95 text-white "
              >
                {tag}
                <span
                  onClick={() => removeTag(index)}
                  className="cursor-pointer"
                >
                  ✕
                </span>
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Input
              placeholder={input.placeholder || "اكتب كلمة..."}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="h-11 w-11 bg-white"
            >
              <Plus className="text-black-blue" />
            </Button>
          </div>
        </div>
      </FormControl>
      <FormDescription className="text-xs text-black-blue/80 font-sora">
        Press the plus button to add more.
      </FormDescription>
      {form.formState.errors[input.name] &&
        renderErrorMessages(form.formState.errors[input.name])}
    </FormItem>
  );
};

export default MultiInputForm;
