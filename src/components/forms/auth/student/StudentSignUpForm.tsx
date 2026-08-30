import { Form } from "@/components/ui/form";

import { STUDENT_SIGNUP_FORM_INPUTS } from "@/constant";
import { studentSignUpSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import RenderSignUpFormFields from "../RenderSignUpFormFields";
import { useEffect, useState } from "react";
import {
  useGetAllCountries,
  useGetAllEducationLevels,
  useGetAllEducationSystems,
} from "@/lib/react-query/main";
import { login } from "@/store/features/auth/authSlice";
import handleResError from "@/utils/handleResponseError";
import { useAppDispatch } from "@/store/store";
import { useStudentRegister } from "@/lib/react-query/auth/student";
import SubmitAuthButton from "../SubmitAuthButton";
import Swal from "sweetalert2";

const StudentSignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [countryId, setCountryId] = useState("");
  const [educationSystemId, setEducationSystemId] = useState("");

  const { data: countries } = useGetAllCountries();
  const { data: educationSystems } = useGetAllEducationSystems(countryId);
  const { data: educationLevels } = useGetAllEducationLevels(educationSystemId);
  const countriesOptions = countries?.data.map((country) => ({
    label: `${country.code} - ${country.name}`,
    value: `${country.id}`,
  }));

  const educationSystemsOptions = educationSystems?.data.map((system) => ({
    label: system.name,
    value: `${system.id}`,
  }));
  const educationLevelsOptions = educationLevels?.data.map((level) => ({
    label: level.name,
    value: `${level.id}`,
  }));

  const { mutateAsync: studentRegister, isPending } = useStudentRegister();

  const form = useForm<z.infer<typeof studentSignUpSchema>>({
    resolver: zodResolver(studentSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      gender: "",
      country_id: "",
      phone: "",
      education_system_id: "",
      education_level_id: "",
      address: "",
    },
  });
  const onSubmit = async (user: z.infer<typeof studentSignUpSchema>) => {
    try {
      const { data, message, status } = await studentRegister(user);
      // ! Register Failed
      if (!status)
        return Swal.fire({
          title: "Error",
          text: message!,
          icon: "error",
        });

      // * Register Success
      Swal.fire({
        title: "Success",
        text: message!,
        icon: "success",
      });

      dispatch(
        login({
          token: data.token,
          role: "student",
        })
      );
      return navigate("/verify-account", { replace: true });
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country_id") {
        setCountryId(value.country_id as string);
        form.setValue("education_system_id", "");
        form.setValue("education_level_id", "");
      }

      if (name === "education_system_id") {
        setEducationSystemId(value.education_system_id as string);
        form.setValue("education_level_id", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      animate={{ opacity: 1, x: 0 }}
      className="md:w-3/4 lg:w-1/2 order-2 md:order-1 flex  items-center justify-center bg-white-gray"
    >
      <div className="w-full max-w-[520px] p-4 md:p-8">
        <h2 className="text-3xl font-bold text-main mt-10 uppercase">
          SIGN UP
        </h2>
        <div className="flex-grow border-t border-main my-5"></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            {STUDENT_SIGNUP_FORM_INPUTS.map((input) => (
              <RenderSignUpFormFields
                key={input.name}
                input={input}
                form={form}
                schema={studentSignUpSchema}
                options={{
                  countries: countriesOptions!,
                  educationSystems: educationSystemsOptions!,
                  educationLevels: educationLevelsOptions!,
                }}
              />
            ))}

            <SubmitAuthButton title="sign up" isLoading={isPending} />
          </form>
        </Form>
        <p className="text-left font-sora font-normal text-base text-black-blue mt-4">
          Already have an account?
          <Link to="/sign-in" className="text-main hover:underline ms-1">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default StudentSignUpForm;
