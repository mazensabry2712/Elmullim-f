import QueryKeys from "@/enums";
import { updateStudentLocation, IStudentLocationPayload } from "@/services/student/location";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateStudentLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: IStudentLocationPayload }) =>
      updateStudentLocation({ token, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.STUDENT_LOCATION] });
    },
  });
};
