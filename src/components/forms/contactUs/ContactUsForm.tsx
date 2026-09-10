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
import { useI18n } from "@/i18n";

const copy = {
  en: {
    name: "Name",
    email: "Email Address",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    send: "Send a Message",
  },
  ar: {
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    subject: "الموضوع",
    message: "الرسالة",
    send: "إرسال الرسالة",
  },
} as const;

const ContactUsForm = () => {
  const { language } = useI18n();
  const labels = copy[language];
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

  const onSubmit = (data: z.infer<typeof contactUsSchema>) => {
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Message: ${data.message}`,
    ].join("\n");

    window.location.href = `mailto:support@elmullim.com?subject=${encodeURIComponent(
      data.subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const getLabel = (name: string) => {
    if (name === "name") return labels.name;
    if (name === "email") return labels.email;
    if (name === "phone") return labels.phone;
    if (name === "subject") return labels.subject;
    return labels.message;
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate={false}
      >
        {CONTACT_US_FORM_INPUTS.map((input) => (
          <FormField
            key={input.name}
            name={input.name as keyof z.infer<typeof contactUsSchema>}
            control={form.control}
            render={({ field }) =>
              input.name === "message" ? (
                <FormItem>
                  <FormLabel className="text-black-blue md:text-lg font-bold">
                    {getLabel(input.name)}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={labels.message}
                      className="h-24 resize-none bg-white text-black-blue border-white focus-visible:ring-0 placeholder:text-black-blue/90 placeholder:text-sm placeholder:font-sora"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) : (
                <InputFormItem
                  field={field}
                  input={{ ...input, label: getLabel(input.name), placeholder: getLabel(input.name) }}
                  label={true}
                />
              )
            }
          />
        ))}
        <button
          type="submit"
          className="w-full lg:w-fit flex justify-center items-center gap-2 text-white capitalize font-sora font-light bg-main px-7 py-3 md:py-4 rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
        >
          {labels.send} <ArrowRight className="flex-shrink-0" aria-hidden="true" />
        </button>
      </form>
    </Form>
  );
};

export default ContactUsForm;
