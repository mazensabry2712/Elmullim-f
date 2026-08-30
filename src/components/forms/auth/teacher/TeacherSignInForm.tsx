import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SIGNIN_FORM_INPUTS } from "@/constant";
import { signInSchema } from "@/validations/auth";
import { motion } from "framer-motion";
import { useTeacherLogin } from "@/lib/react-query/auth/teacher";
import { useAppDispatch } from "@/store/store";
import handleResError from "@/utils/handleResponseError";
import { login } from "@/store/features/auth/authSlice";
import SubmitAuthButton from "../SubmitAuthButton";
import Swal from "sweetalert2";

const TeacherSignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutateAsync: teacherLogin, isPending } = useTeacherLogin();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof signInSchema>) => {
    try {
      const { data, message, status } = await teacherLogin({
        email,
        password,
      });
      // ! Login Failed
      if (!status)
        return Swal.fire({
          title: "Error",
          text: message!,
          icon: "error",
        });

      // * Login Failed
      Swal.fire({
        title: "Success",
        text: message!,
        icon: "success",
      });

      dispatch(
        login({
          token: data.token,
          role: "teacher",
        })
      );
      return navigate("/profile", { replace: true });
    } catch (error) {
      handleResError(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      animate={{ opacity: 1, x: 0 }}
      className="md:w-3/4 lg:w-1/2 order-2 md:order-1 flex  items-center justify-center bg-white-gray"
    >
      <div className="w-full max-w-[520px] p-4 md:p-8">
        <h2 className="text-3xl font-bold text-main mt-10 uppercase">
          teacher LOGIN
        </h2>
        <div className="flex-grow border-t border-main my-5"></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {SIGNIN_FORM_INPUTS.map((input) => (
              <FormField
                key={input.name}
                control={form.control}
                name={input.name as keyof z.infer<typeof signInSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={input.placeholder}
                        type={input.type}
                        {...field}
                        className="bg-white py-6 text-black-blue border-white focus-visible:ring-0 placeholder:text-black-blue placeholder:text-base placeholder:font-sora"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Link
              to="/teacher/forgot-password"
              className="flex text-sm font-sora text-red-500 hover:underline transition-all duration-200 !mt-1"
            >
              Forgot password?
            </Link>
            <SubmitAuthButton title="login" isLoading={isPending} />
          </form>
        </Form>
        <p className="text-left font-sora font-normal text-base text-black-blue mt-4">
          Don't have an account?
          <Link
            to="/teacher/sign-up"
            className="text-main hover:underline ms-1"
          >
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default TeacherSignInForm;
