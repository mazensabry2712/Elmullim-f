import { containerVariants } from "@/animations";
import AuthHeader from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RESET_PASSWORD_FORM_INPUTS } from "@/constant";
import { useResetPassword } from "@/lib/react-query/auth";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { resetPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const ParentResetPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const canReset = cookieService.getCanResetPass()!;
    if (!canReset || canReset !== "parent") navigate("/parent/forgot-password");
  }, [navigate]);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async ({
    code,
    password,
    password_confirmation,
  }: z.infer<typeof resetPasswordSchema>) => {
    try {
      const { message, status } = await resetPassword({
        role: "parent",
        code,
        password,
        password_confirmation,
      });
      if (!status) return toast.error(message);

      cookieService.clearCanResetPass();
      toast.success(message);
      return navigate("/parent/sign-in");
    } catch (error) {
      handleResError(error);
    }
  };

  return (
    <>
      <AuthHeader
        title="Forgot password"
        linkPath="/login"
        linkTitle="login"
        description={"Don't worry, we will help you recover your account!"}
        discover={false}
      />
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white py-4"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between container">
          {/* Left Side*/}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-3/4 lg:w-1/2 order-2 lg:order-1 flex  items-center justify-center"
          >
            <div className="w-full max-w-[520px] p-4 md:p-8 space-y-4 bg-white-gray shadow-md">
              <div className="text-center lg:text-start">
                <h2 className="text-3xl font-bold text-main uppercase">
                  Reset password
                </h2>
                <div className="flex-grow border-t border-main my-3" />
                <p className="text-black/50 text-sm font-fora">
                  Please enter the verification code we sent to your email, and
                  choose a new password for your account.
                </p>
              </div>
              <Form {...form}>
                <form
                  className="mx-auto md:ml-0 space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {RESET_PASSWORD_FORM_INPUTS.map((input) => (
                    <FormField
                      key={input.name}
                      control={form.control}
                      name={
                        input.name as keyof z.infer<typeof resetPasswordSchema>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type={input.type}
                              placeholder={input.placeholder}
                              autoComplete={"on"}
                              {...field}
                              className="bg-white py-6 text-black-blue focus-visible:ring-0 placeholder:text-black-blue/90 placeholder:text-sm placeholder:font-sora border-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-auto bg-main hover:bg-main text-white py-2.5 font-sora font-light text-lg flex justify-center items-center gap-2"
                  >
                    {isPending && (
                      <span className="flex-shrink-0 w-6">
                        <LoaderCircle className="animate-spin !w-6 !h-6" />
                      </span>
                    )}
                    Send reset code
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: "linear" }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-2/4 lg:w-1/2 order-1 flex items-center justify-center"
          >
            <div className="text-center">
              <img
                src="/images/verify-account.webp"
                alt="Parent login image"
                className="w-full h-full mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default ParentResetPassword;
