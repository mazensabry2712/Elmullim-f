import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import Dropzone from "react-dropzone";
import { useI18n } from "@/i18n";

const ImagePreview = ({
  url,
  onRemove,
  removeImageLabel,
}: {
  url: string;
  onRemove: () => void;
  removeImageLabel: string;
}) => (
  <div className="relative aspect-video md:max-h-[600px] h-full">
    <button
      type="button"
      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={onRemove}
      aria-label={removeImageLabel}
      title={removeImageLabel}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <img
      src={url}
      height={"100%"}
      width={"100%"}
      alt=""
      className="border border-border h-full w-full rounded-md object-cover"
    />
  </div>
);

interface IProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  title?: string;
  existingUrl?: string;
}
const ImageUpload = ({ title, file, setFile, existingUrl }: IProps) => {
  const { language } = useI18n();
  const removeImageLabel = language === "ar" ? "حذف الصورة" : "Remove image";
  const dragDropLabel = language === "ar" ? "اسحب الصورة وأفلتها" : "Drag and Drop";
  const imageTitle = title ?? (language === "ar" ? "الصورة" : "Image");

  return (
    <div className="w-full max-w-full">
      <Label htmlFor="img" className="cursor-pointer">
        {imageTitle}
      </Label>
      <div className="mt-1 w-full space-y-3">
        {file ? (
          <ImagePreview
            url={URL.createObjectURL(file)}
            onRemove={() => setFile(null)}
            removeImageLabel={removeImageLabel}
          />
        ) : existingUrl ? (
          <>
            <div className="rounded-md border border-border bg-muted/20 p-2">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                {language === "ar" ? "الصورة الحالية" : "Current image"}
              </p>
              <img
                src={existingUrl}
                alt={imageTitle}
                className="aspect-video h-full max-h-[600px] w-full rounded-md object-cover"
              />
            </div>
            <Dropzone
              onDrop={(acceptedFiles) => {
                const nextFile = acceptedFiles[0];
                if (nextFile) setFile(nextFile);
              }}
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/webp": [".webp"],
                "image/svg+xml": [".svg"],
              }}
              maxFiles={1}
            >
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragAccept,
                isDragReject,
              }) => (
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex min-h-24 cursor-pointer items-center justify-center rounded-md border-[1.5px] border-dashed border-main px-4 py-5 text-center focus:outline-none focus:border-primary",
                    {
                      "border-primary bg-secondary": isDragActive && isDragAccept,
                      "border-destructive bg-destructive/20":
                        isDragActive && isDragReject,
                    }
                  )}
                >
                  <input {...getInputProps()} id="img-replace" />
                  <div>
                    <ImageIcon className="mx-auto h-9 w-9" strokeWidth={1.25} />
                    <p className="mt-2 text-sm font-semibold">
                      {language === "ar"
                        ? "اختَر صورة جديدة لاستبدال الحالية"
                        : "Choose a new image to replace the current one"}
                    </p>
                  </div>
                </div>
              )}
            </Dropzone>
          </>
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const nextFile = acceptedFiles[0];
              if (nextFile) setFile(nextFile);
            }}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
            maxFiles={1}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "aspect-video cursor-pointer md:max-h-[600px] h-full border-[1.5px] border-main border-dashed flex items-center justify-center rounded-md focus:outline-none focus:border-primary",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="img" />
                <div className="flex flex-col gap-2 justify-center items-center">
                  <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
                  <p>{dragDropLabel}</p>
                </div>
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
