import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CONTACT_US_FORM_INPUTS } from "@/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputFormItem from "../formItems/InputFormItem";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import contactUsSchema from "@/validations/contactUsSchema";

const ContactUsForm = () => {
  const form = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
      phone: "",
      subject: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof contactUsSchema>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {CONTACT_US_FORM_INPUTS.map((input) => (
          <FormField
            key={input.name}
            name={input.name as keyof z.infer<typeof contactUsSchema>}
            control={form.control}
            render={({ field }) =>
              input.name === "message" ? (
                <FormItem>
                  <FormLabel className="text-black-blue md:text-lg font-bold">
                    {input.label}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="message"
                      className="h-24 resize-none bg-white text-black-blue border-white focus-visible:ring-0 placeholder:text-black-blue/90 placeholder:text-sm placeholder:font-sora"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) : (
                <InputFormItem field={field} input={input} label={true} />
              )
            }
          />
        ))}
        <button className="w-full lg:w-fit flex justify-center items-center gap-2 text-white capitalize font-sora font-light bg-main px-7 py-3 md:py-4 rounded-[5px]">
          send a message <ArrowRight className="flex-shrink-0" />
        </button>
      </form>
    </Form>
  );
};

export default ContactUsForm;
