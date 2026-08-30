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
import { useForgotPassword } from "@/lib/react-query/auth";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { forgotPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const StudentForgotPassword = () => {
  const navigate = useNavigate();
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const { message, status } = await forgotPassword({
        role: "student",
        email,
      });
      if (!status) return toast.error(message);

      cookieService.setCanResetPass("student");
      navigate("/reset-password");
      return toast.success(message);
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
                  Forgot password
                </h2>
                <div className="flex-grow border-t border-main my-3" />
                <p className="text-black/50 text-sm font-fora">
                  Please enter your email associated with your account, and we
                  will send you a verification code that you can use to reset
                  your password.
                </p>
              </div>
              <Form {...form}>
                <form
                  className="mx-auto md:ml-0 space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type={"text"}
                            placeholder={"Email"}
                            autoComplete={"on"}
                            {...field}
                            className="bg-white py-6 text-black-blue focus-visible:ring-0 placeholder:text-black-blue/90 placeholder:text-sm placeholder:font-sora border-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

export default StudentForgotPassword;
