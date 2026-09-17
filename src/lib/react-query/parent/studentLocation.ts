import QueryKeys from "@/enums";
import { IStudentLocationPayload } from "@/services/student/location";
import { updateParentStudentLocation } from "@/services/parent/studentLocation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateParentStudentLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      studentId,
      payload,
    }: {
      token: string;
      studentId: number;
      payload: IStudentLocationPayload;
    }) => updateParentStudentLocation({ token, studentId, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PARENT_STUDENT_LOCATION, variables.studentId] });
    },
  });
};
