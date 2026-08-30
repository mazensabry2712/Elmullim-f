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

const VerifyAccountForm = () => {
  const role = cookieService.getRole()!;
  const token = cookieService.getToken()!;
  const navigate = useNavigate();

  const { mutateAsync: studentVerifyAccount, isPending: studentIsPending } =
    useStudentVerifyAccount();
  const { mutateAsync: parentVerifyAccount, isPending: parentIsPending } =
    useParentVerifyAccount();
  const { mutateAsync: teacherVerifyAccount, isPending: teacherIsPending } =
    useTeacherVerifyAccount();

  const { mutateAsync: resendCode } = useSendVerificationEmail();
  const form = useForm<z.infer<typeof verifyAccountSchema>>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      code: "",
    },
  });

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
    try {
      const { message, status } = await resendCode(token);
      if (!status) return toast.error(message);
      return toast.success(message);
    } catch (error) {
      handleResError(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:w-3/4 order-2 lg:order-1 max-w-[550px] space-y-6"
    >
      <div className="w-full lg:py-8 flex flex-col lg:flex-row items-center">
        <h2 className="text-5xl font-bold text-black-blue uppercase text-nowrap">
          OTP CODE
        </h2>
        <h2 className="h-[120px] w-[270px] md:w-[320px] flex items-center justify-center text-4xl font-bold text-main font-exo bg-[url('/icons/verification-code-circle.svg')] bg-contain bg-no-repeat bg-center">
          Verification
        </h2>
      </div>
      <Form {...form}>
        <form
          className="mx-auto md:ml-0 space-y-6 max-w-min"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      autoFocus
                    >
                      <InputOTPGroup className="space-x-1">
                        <InputOTPSlot
                          index={0}
                          className="rounded-md border-2 w-10 h-10 md:w-16 md:h-16 border-main focus-visible:border-main md:text-xl"
                        />
                        <InputOTPSlot
                          index={1}
                          className="rounded-md border-2 w-10 h-10 md:w-16 md:h-16 border-main focus-visible:border-main md:text-xl"
                        />
                        <InputOTPSlot
                          index={2}
                          className="rounded-md border-2 w-10 h-10 md:w-16 md:h-16 border-main focus-visible:border-main md:text-xl"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="space-x-1">
                        <InputOTPSlot
                          index={3}
                          className="rounded-md border-2 w-10 h-10 md:w-16 md:h-16 border-main focus-visible:border-main md:text-xl"
                        />
                        <InputOTPSlot
                          index={4}
                          className="rounded-md border-2 w-10 h-10 md:w-16 md:h-16 border-main focus-visible:border-main md:text-xl"
                        />
                        <InputOTPSlot
                          index={5}
                          className="rounded-md border-2 w-10 h-10 md:w-16 md:h-16 border-main focus-visible:border-main md:text-xl"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <SubmitAuthButton
            title="verify"
            isLoading={studentIsPending || parentIsPending || teacherIsPending}
          />
        </form>
        <p className="text-black-blue !mt-2">
          Not received your code?{" "}
          <Button
            variant={"link"}
            className="text-main px-0"
            onClick={resendOtpCode}
          >
            Resend code
          </Button>
        </p>
      </Form>
    </motion.div>
  );
};

export default VerifyAccountForm;
