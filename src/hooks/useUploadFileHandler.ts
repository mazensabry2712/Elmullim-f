import { UseFormReturn } from "react-hook-form";
import { isValidFileType } from "@/utils/file";

export const useUploadFileHandler = (
  form: UseFormReturn<any>,
  acceptedTypes: string[]
) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidFileType(file, acceptedTypes)) {
        const acceptedExtensions = acceptedTypes
          .map((type) => {
            switch (type) {
              case "image/jpeg":
              case "image/jpg":
                return ".jpg";
              case "image/png":
                return ".png";
              case "image/webp":
                return ".webp";
              case "application/pdf":
                return ".pdf";
              case "application/msword":
                return ".doc";
              case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return ".docx";
              case "text/plain":
                return ".txt";
              case "application/rtf":
                return ".rtf";
              case "application/vnd.oasis.opendocument.text":
                return ".odt";
              default:
                return null;
            }
          })
          .filter(Boolean)
          .join(", ");

        form.setError(e.target.name, {
          message: `File type not supported. The supported types are: ${acceptedExtensions}`,
        });
        return;
      }

      fieldChange(file);
    }
  };

  return { handleFileChange };
};
