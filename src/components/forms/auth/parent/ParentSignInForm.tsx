import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/validations/auth";
import { SIGNIN_FORM_INPUTS } from "@/constant";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/store/store";
import { useParentLogin } from "@/lib/react-query/auth/parent";
import handleResError from "@/utils/handleResponseError";
import { login } from "@/store/features/auth/authSlice";
import SubmitAuthButton from "../SubmitAuthButton";
import Swal from "sweetalert2";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";

const ParentSignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutateAsync: parentLogin, isPending } = useParentLogin();
  const { language } = useI18n();
  const copy = getAuthCopy(language);
  const form = useForm<z.infer<typeof signInSchema>>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = async ({ email, password }: z.infer<typeof signInSchema>) => {
    try {
      const { data, message, status } = await parentLogin({ email, password });
      if (!status) return Swal.fire({ title: copy.error, text: message!, icon: "error" });
      Swal.fire({ title: copy.success, text: message!, icon: "success" });
      dispatch(login({ token: data.token, role: "parent" }));
      return navigate("/profile", { replace: true });
    } catch (error) { handleResError(error); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: "easeInOut" }} animate={{ opacity: 1, x: 0 }} className="md:w-3/4 lg:w-1/2 order-2 md:order-1 flex items-center justify-center bg-white-gray">
      <div className="w-full max-w-[520px] p-4 md:p-8">
        <h2 className="text-3xl font-bold text-main mt-10 uppercase">{copy.parentLogin}</h2>
        <div className="flex-grow border-t border-main my-5" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form space-y-4">
            {SIGNIN_FORM_INPUTS.map((input) => (
              <FormField key={input.name} control={form.control} name={input.name as keyof z.infer<typeof signInSchema>} render={({ field }) => (
                <FormItem><FormControl><Input placeholder={language === "ar" ? (input.name === "email" ? "البريد الإلكتروني *" : "كلمة المرور *") : input.placeholder} type={input.name === "email" ? "email" : input.type} autoComplete={input.name === "email" ? "email" : "current-password"} {...field} className="bg-white py-6 text-black-blue border-white focus-visible:ring-0 placeholder:text-black-blue placeholder:text-base placeholder:font-sora" /></FormControl><FormMessage /></FormItem>
              )} />
            ))}
            <Link to="/parent/forgot-password" className="flex text-sm font-sora text-red-500 hover:underline transition-all duration-200 !mt-1">{copy.forgotPassword}</Link>
            <SubmitAuthButton title="Login" isLoading={isPending} />
          </form>
        </Form>
        <p className="text-left font-sora font-normal text-base text-black-blue mt-4">{copy.dontHaveAccount}<Link to="/parent/sign-up" className="text-main hover:underline ms-1">{copy.createAccount}</Link></p>
      </div>
    </motion.div>
  );
};

export default ParentSignInForm;
