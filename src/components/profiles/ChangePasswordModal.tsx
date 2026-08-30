import { Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import Modal from "../shared/Modal";
import { Form, FormField } from "../ui/form";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { CHANGE_PASSWORD_INPUTS } from "@/constant";
import InputFormItem from "../forms/formItems/InputFormItem";
import { z } from "zod";
import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { changePasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePassword } from "@/lib/react-query/auth";
import handleResError from "@/utils/handleResponseError";
import cookieService from "@/utils/cookieService";
import Swal from "sweetalert2";

const ChangePasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const role = cookieService.getRole()!;

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();

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
      if (!status)
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
      });
    } catch (error) {
      handleResError(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <>
      <button
        className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
        onClick={() => setIsOpen(true)}>
        <LockKeyhole className="h-4 w-4" /> Change password
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        title="Change Password"
        description={{
          text: "You can change your password here.",
        }}
        showFooter={false}>
        <Form {...form}>
          <motion.form
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 text-black-blue">
            {CHANGE_PASSWORD_INPUTS.map((input) => (
              <motion.div
                variants={itemVariants}
                key={input.name}
                custom={input.name}>
                <FormField
                  control={form.control}
                  name={
                    input.name as keyof z.infer<typeof changePasswordSchema>
                  }
                  render={({ field }) => (
                    <InputFormItem
                      field={
                        field as unknown as ControllerRenderProps<
                          FieldValues,
                          string
                        >
                      }
                      input={input}
                      label
                    />
                  )}
                />
              </motion.div>
            ))}

            <AlertDialogFooter className="text-start gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="py-2.5 h-auto bg-main hover:bg-main/90">
                Change Password
                {isPending && <Loader2 className="animate-spin ml-2" />}
              </Button>
              <AlertDialogCancel
                onClick={handleCloseModal}
                className="py-2.5 h-auto bg-primary text-white hover:bg-primary/90 hover:text-white">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </motion.form>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
