import { Form } from "@/components/ui/form";
import { UPDATE_STUDENT_PROFILE } from "@/constant";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import RenderProfileFormFields from "./RenderProfileFormFields";
import { updateStudentProfileSchema } from "@/validations/student/studentProfile";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import {
  useGetStudentProfile,
  useUpdateStudentProfile,
} from "@/lib/react-query/student/studentProfile";
import { LoaderCircle } from "lucide-react";
import { containerVariants, itemVariants } from "@/animations";
import { useEffect, useState } from "react";
import {
  useGetAllCountries,
  useGetAllEducationLevels,
  useGetAllEducationSystems,
  useGetAllSubjects,
} from "@/lib/react-query/main";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateStudentProfileForm = () => {
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentProfile(token);
  const student = data?.data;
  const [countryId, setCountryId] = useState(
    student?.education_level.education_system.country.id.toString() || ""
  );
  const [educationSystemId, setEducationSystemId] = useState(
    student?.education_level.education_system.id.toString() || ""
  );
  const [educationLevelId, setEducationLevelId] = useState(
    student?.education_level.id.toString() || ""
  );

  const { data: countries } = useGetAllCountries();
  const { data: educationSystems } = useGetAllEducationSystems(countryId);
  const { data: educationLevels } = useGetAllEducationLevels(educationSystemId);
  const { data: subjects } = useGetAllSubjects(educationLevelId);

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
  const subjectsOptions = subjects?.data?.map((subject) => ({
    label: subject.name,
    value: `${subject.id}`,
  }));

  const { mutateAsync: updateStudentProfile, isPending } =
    useUpdateStudentProfile();
  const form = useForm<z.infer<typeof updateStudentProfileSchema>>({
    resolver: zodResolver(updateStudentProfileSchema),
    defaultValues: {
      name: "",
      address: "",
      education_system_id: "",
      education_level_id: "",
      email: "",
      gender: "",
      phone: "",
      profile_image: undefined,
      country_id: "",
      description: "",
      favourite_subjects: [],
    },
  });

  const onSubmit = async ({
    address,
    email,
    gender,
    name,
    phone,
    education_level_id,
    favourite_subjects,
    profile_image,
    description,
  }: z.infer<typeof updateStudentProfileSchema>) => {
    try {
      const { status, message } = await updateStudentProfile({
        token,
        dataForm: {
          address,
          education_level_id,
          email,
          gender,
          name,
          phone,
          description,
          favourite_subjects,
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
      name: student?.name || "",
      phone: student?.phone || "",
      email: student?.email || "",
      address: student?.address || "",
      gender: student?.gender || "",
      description: student?.description || "",
      country_id:
        student?.education_level.education_system.country.id.toString() || "",
      education_system_id:
        student?.education_level.education_system.id.toString() || "",
      education_level_id: student?.education_level.id.toString() || "",
      favourite_subjects: student?.favourite_subjects.map((subject) =>
        subject.id.toString()
      ),
    });
  }, [form, student]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country_id") {
        setCountryId(value.country_id as string);
        form.setValue("education_system_id", "");
        form.setValue("education_level_id", "");
        form.setValue("favourite_subjects", []);
      }

      if (name === "education_system_id") {
        setEducationSystemId(value.education_system_id as string);
        form.setValue("education_level_id", "");
        form.setValue("favourite_subjects", []);
      }

      if (name === "education_level_id") {
        setEducationLevelId(value.education_level_id as string);
        form.setValue("favourite_subjects", []);
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
          {UPDATE_STUDENT_PROFILE.map((input, idx) => (
            <motion.div
              key={input.name}
              custom={idx}
              variants={itemVariants}
              className="h-fit"
            >
              <RenderProfileFormFields
                input={input}
                form={form}
                schema={updateStudentProfileSchema}
                options={{
                  countries: countriesOptions!,
                  educationSystems: educationSystemsOptions!,
                  educationLevels: educationLevelsOptions!,
                  subjects: subjectsOptions!,
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

export default UpdateStudentProfileForm;
