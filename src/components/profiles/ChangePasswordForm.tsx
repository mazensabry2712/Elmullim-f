import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/validations/auth";
import { useUpdatePassword } from "@/lib/react-query/auth";
import handleResError from "@/utils/handleResponseError";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";
import { translateFormText } from "@/i18n/formCopy";
import { CHANGE_PASSWORD_INPUTS } from "@/constant";

const ChangePasswordForm = () => {
  const { language } = useI18n();
  const copy = getAuthCopy(language);
  const ar = language === "ar";
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole()!;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmation(false);
  }, [language]);

  const onSubmit = async ({
    password,
    password_confirmation,
  }: z.infer<typeof changePasswordSchema>) => {
    try {
      const { message, status } = await updatePassword({
        password,
        password_confirmation,
        token,
        role,
      });

      if (!status) {
        await Swal.fire({
          icon: "error",
          title: copy.error,
          text: message,
          confirmButtonText: ar ? "حسنًا" : "OK",
        });
        return;
      }

      form.reset();
      setShowPassword(false);
      setShowConfirmation(false);

      await Swal.fire({
        icon: "success",
        title: copy.success,
        text: message,
        confirmButtonText: ar ? "تم" : "Done",
      });
    } catch (error) {
      handleResError(error);
    }
  };

  return (
    <section
      dir={ar ? "rtl" : "ltr"}
      className="mt-10 border-t border-black-blue/10 pt-8"
      aria-labelledby="change-password-title"
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main text-black-blue">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 id="change-password-title" className="text-xl font-bold text-black-blue">
            {copy.changePassword}
          </h3>
          <p className="mt-1 max-w-2xl font-sora text-sm leading-6 text-black-blue/60">
            {copy.changePasswordDescription}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {CHANGE_PASSWORD_INPUTS.map((input) => {
            const isConfirmation = input.name === "password_confirmation";
            const visible = isConfirmation ? showConfirmation : showPassword;

            return (
              <FormField
                key={input.name}
                control={form.control}
                name={input.name as keyof z.infer<typeof changePasswordSchema>}
                render={({ field }) => (
                  <div className="space-y-2">
                    <label
                      htmlFor={input.name}
                      className="block font-sora text-sm font-semibold text-black-blue"
                    >
                      {translateFormText(language, input.label)}
                    </label>

                    <div className="relative">
                      <Input
                        id={input.name}
                        type={visible ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={translateFormText(language, input.placeholder)}
                        {...(field as unknown as ControllerRenderProps<FieldValues, string>)}
                        className="h-12 bg-white pe-12 text-black-blue placeholder:text-black-blue/40 focus-visible:ring-2 focus-visible:ring-main"
                      />

                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={
                          visible
                            ? ar
                              ? "إخفاء كلمة المرور"
                              : "Hide password"
                            : ar
                              ? "إظهار كلمة المرور"
                              : "Show password"
                        }
                        onClick={() =>
                          isConfirmation
                            ? setShowConfirmation((current) => !current)
                            : setShowPassword((current) => !current)
                        }
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-black-blue/50 transition hover:text-black-blue focus:outline-none"
                      >
                        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {form.formState.errors[input.name as keyof z.infer<typeof changePasswordSchema>] && (
                      <p className="text-xs font-medium text-red-500">
                        {form.formState.errors[input.name as keyof z.infer<typeof changePasswordSchema>]?.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            );
          })}

          <div className="flex items-end md:col-span-2 md:justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full bg-main font-semibold text-black-blue hover:bg-main/90 md:w-auto md:min-w-48"
            >
              {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {copy.changePassword}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ChangePasswordForm;
