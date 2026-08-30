import { Form } from "@/components/ui/form";
import { UPDATE_PARENT_PROFILE } from "@/constant";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import RenderProfileFormFields from "./RenderProfileFormFields";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { LoaderCircle } from "lucide-react";
import { containerVariants, itemVariants } from "@/animations";
import { useEffect, useState } from "react";
import {
  useGetAllCountries,
  useGetAllEducationLevels,
  useGetAllEducationSystems,
} from "@/lib/react-query/main";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
import { updateParentProfileSchema } from "@/validations/parent/parentProfile";
import {
  useGetParentProfile,
  useUpdateParentProfile,
} from "@/lib/react-query/parent/parentProfile";
import Swal from "sweetalert2";

const UpdateParentProfileForm = () => {
  const token = cookieService.getToken()!;
  const navigate = useNavigate();

  const { data, isLoading } = useGetParentProfile(token);
  const parent = data?.data;

  const [countryId, setCountryId] = useState(
    parent?.education_level.education_system.country.id.toString() || ""
  );
  const [educationSystemId, setEducationSystemId] = useState(
    parent?.education_level.education_system.id.toString() || ""
  );

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

  const { mutateAsync: updateParentProfile, isPending } =
    useUpdateParentProfile();

  const form = useForm<z.infer<typeof updateParentProfileSchema>>({
    resolver: zodResolver(updateParentProfileSchema),
    defaultValues: {
      name: "",
      education_system_id: "",
      education_level_id: "",
      email: "",
      gender: "",
      phone: "",
      profile_image: undefined,
      country_id: "",
      description: "",
      students: [],
    },
  });

  const onSubmit = async ({
    email,
    gender,
    name,
    phone,
    education_level_id,
    profile_image,
    description,
    students,
  }: z.infer<typeof updateParentProfileSchema>) => {
    try {
      const { status, message } = await updateParentProfile({
        token,
        dataForm: {
          education_level_id,
          email,
          gender,
          name,
          phone,
          description,
          students,
          profile_image,
        },
      });
      if (!status)
        return Swal.fire({
          title: "Error",
          text: message!,
          icon: "error",
        });
      Swal.fire({
        title: "Success",
        text: message || "Profile info has been updated successfully",
        icon: "success",
      });

      navigate("/profile");
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    form.reset({
      name: parent?.name || "",
      phone: parent?.phone || "",
      email: parent?.email || "",
      gender: parent?.gender || "",
      description: parent?.description || "",
      country_id:
        parent?.education_level.education_system.country.id.toString() || "",
      education_system_id:
        parent?.education_level.education_system.id.toString() || "",
      education_level_id: parent?.education_level.id.toString() || "",
      students: parent?.students.map((student) => student.phone),
    });
  }, [form, parent]);

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

  if (isLoading) {
    return (
      <div className="my-10">
        <Loader />
      </div>
    );
  }
  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
          {UPDATE_PARENT_PROFILE.map((input, idx) => (
            <motion.div key={input.name} custom={idx} variants={itemVariants}>
              <RenderProfileFormFields
                input={input}
                form={form}
                schema={updateParentProfileSchema}
                options={{
                  countries: countriesOptions!,
                  educationSystems: educationSystemsOptions!,
                  educationLevels: educationLevelsOptions!,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full text-[#FCFCFC] bg-main hover:bg-main/90 text-xl md:text-2xl h-auto font-sora font-light capitalize py-3"
          >
            {isPending && (
              <span className="flex-shrink-0 w-6">
                <LoaderCircle className="animate-spin !w-6 !h-6" />
              </span>
            )}
            Update info
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default UpdateParentProfileForm;
