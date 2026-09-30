import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { changePasswordSchema } from "@/validations/auth";
import { useUpdatePassword } from "@/lib/react-query/auth";
import handleResError from "@/utils/handleResponseError";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";
import { translateFormText } from "@/i18n/formCopy";
import { CHANGE_PASSWORD_INPUTS } from "@/constant";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({ isOpen, onOpenChange }: ChangePasswordModalProps) => {
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
    if (isOpen) {
      form.reset({
        password: "",
        password_confirmation: "",
      });
      setShowPassword(false);
      setShowConfirmation(false);
    }
  }, [isOpen, form]);

  const handleClose = () => {
    if (isPending) {
      return;
    }

    onOpenChange(false);
  };

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

      await Swal.fire({
        icon: "success",
        title: copy.success,
        text: message,
        confirmButtonText: ar ? "تم" : "Done",
      });

      onOpenChange(false);
    } catch (error) {
      handleResError(error);
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => {
      if (!open && isPending) {
        return;
      }

      onOpenChange(open);
    }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          dir={ar ? "rtl" : "ltr"}
          className="fixed left-1/2 top-1/2 z-[1101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-black-blue/10 bg-white shadow-2xl outline-none"
        >
          <div className="relative bg-black-blue px-5 pb-7 pt-5 text-white sm:px-7">
            <DialogPrimitive.Close
              asChild
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                handleClose();
              }}
            >
              <button
                type="button"
                aria-label={ar ? "إغلاق" : "Close"}
                className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-main disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogPrimitive.Close>

            <div className="flex items-start gap-3 pe-10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main text-black-blue">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-xl font-bold leading-tight">
                  {copy.changePassword}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1 text-sm leading-6 text-white/75">
                  {copy.changePasswordDescription}
                </DialogPrimitive.Description>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5 sm:p-7">
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
                            autoComplete={isConfirmation ? "new-password" : "new-password"}
                            placeholder={translateFormText(language, input.placeholder)}
                            {...(field as unknown as ControllerRenderProps<FieldValues, string>)}
                            className={`h-12 bg-white pe-12 text-black-blue placeholder:text-black-blue/40 focus-visible:ring-2 focus-visible:ring-main ${ar ? "ps-3" : "ps-3"}`}
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
                            {visible ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
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

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                  className="h-12 w-full border-black-blue/15 text-black-blue sm:w-auto sm:min-w-32"
                >
                  {copy.cancel}
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 w-full bg-main font-semibold text-black-blue hover:bg-main/90 sm:w-auto sm:min-w-44"
                >
                  {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {copy.changePassword}
                </Button>
              </div>
            </form>
          </Form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ChangePasswordModal;
