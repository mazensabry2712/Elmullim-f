import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import SubmitAuthButton from "./SubmitAuthButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifyAccountSchema } from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import cookieService from "@/utils/cookieService";
import { useNavigate } from "react-router-dom";
import { useStudentVerifyAccount } from "@/lib/react-query/auth/student";
import { useParentVerifyAccount } from "@/lib/react-query/auth/parent";
import { useTeacherVerifyAccount } from "@/lib/react-query/auth/teacher";
import handleResError from "@/utils/handleResponseError";
import { toast } from "react-toastify";
import { useSendVerificationEmail } from "@/lib/react-query/auth";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyAccountForm = () => {
  const role = cookieService.getRole()!;
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = getAuthCopy(language);

  const { mutateAsync: studentVerifyAccount, isPending: studentIsPending } =
    useStudentVerifyAccount();
  const { mutateAsync: parentVerifyAccount, isPending: parentIsPending } =
    useParentVerifyAccount();
  const { mutateAsync: teacherVerifyAccount, isPending: teacherIsPending } =
    useTeacherVerifyAccount();

  const {
    mutateAsync: resendCode,
    isPending: resendIsPending,
  } = useSendVerificationEmail();

  // The initial verification email is valid for one minute, so keep
  // the resend action disabled for the same initial window.
  const [resendCooldown, setResendCooldown] = useState(
    RESEND_COOLDOWN_SECONDS
  );

  const form = useForm<z.infer<typeof verifyAccountSchema>>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const onSubmit = async ({ code }: z.infer<typeof verifyAccountSchema>) => {
    if (role === "student") {
      try {
        const { message, status } = await studentVerifyAccount({ code, token });
        if (!status) return toast.error(message);

        toast.success(message);
        return navigate("/profile");
      } catch (error) {
        handleResError(error);
      }
    }

    if (role === "parent") {
      try {
        const { message, status } = await parentVerifyAccount({ code, token });
        if (!status) return toast.error(message);

        toast.success(message);
        return navigate("/profile");
      } catch (error) {
        handleResError(error);
      }
    }

    if (role === "teacher") {
      try {
        const { message, status } = await teacherVerifyAccount({ code, token });
        if (!status) return toast.error(message);

        toast.success(message);
        return navigate("/profile");
      } catch (error) {
        handleResError(error);
      }
    }
  };

  const resendOtpCode = async () => {
    if (resendCooldown > 0 || resendIsPending) return;

    try {
      const { message, status } = await resendCode(token);

      if (!status) {
        toast.error(message);
        return;
      }

      form.setValue("code", "");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success(message || copy.verificationCodeSent);
    } catch (error) {
      handleResError(error);
    }
  };

  const isVerifying =
    studentIsPending || parentIsPending || teacherIsPending;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-[550px] space-y-6 lg:w-3/4 order-2 lg:order-1"
    >
      <div className="flex w-full flex-col items-center gap-1 lg:flex-row lg:py-8">
        <h2 className="text-center text-4xl font-bold uppercase text-black-blue sm:text-5xl">
          OTP CODE
        </h2>
        <h2 className="flex h-[100px] w-[240px] items-center justify-center bg-[url('/icons/verification-code-circle.svg')] bg-contain bg-center bg-no-repeat text-center font-exo text-3xl font-bold text-main sm:h-[120px] sm:w-[270px] sm:text-4xl md:w-[320px]">
          Verification
        </h2>
      </div>

      <Form {...form}>
        <form
          className="auth-form w-full space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="w-full overflow-x-auto pb-1">
                    <div className="mx-auto flex w-fit justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        autoFocus
                        disabled={isVerifying}
                      >
                        <InputOTPGroup className="space-x-1">
                          {Array.from({ length: 3 }, (_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-10 w-10 rounded-md border-2 border-main bg-white text-black focus-visible:border-main focus-visible:bg-white focus-visible:text-black sm:h-12 sm:w-12 md:h-16 md:w-16 md:text-xl"
                            />
                          ))}
                        </InputOTPGroup>

                        <InputOTPSeparator />

                        <InputOTPGroup className="space-x-1">
                          {Array.from({ length: 3 }, (_, index) => (
                            <InputOTPSlot
                              key={index + 3}
                              index={index + 3}
                              className="h-10 w-10 rounded-md border-2 border-main focus-visible:border-main sm:h-12 sm:w-12 md:h-16 md:w-16 md:text-xl"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </FormControl>

                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
            <SubmitAuthButton
              title="verify"
              isLoading={isVerifying}
              className="w-full sm:flex-1"
            />

            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-md border border-main/20 px-3 py-2 sm:min-h-12 sm:flex-nowrap">
              <span className="shrink-0 text-xs font-sora text-black-blue/75 sm:text-sm">
                {copy.didNotReceiveCode}
              </span>

              <Button
                type="button"
                variant="link"
                className="h-auto min-h-0 min-w-0 p-0 text-xs font-sora font-semibold text-main hover:bg-transparent hover:text-main sm:text-sm"
                onClick={resendOtpCode}
                disabled={
                  resendCooldown > 0 || resendIsPending || isVerifying
                }
                aria-live="polite"
              >
                <span className="truncate">
                  {resendIsPending
                    ? copy.sending
                    : resendCooldown > 0
                      ? `${copy.resendIn} ${resendCooldown} ${copy.seconds}`
                      : copy.resendCode}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default VerifyAccountForm;
