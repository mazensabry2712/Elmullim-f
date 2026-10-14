"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { VideoIcon, XCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Dropzone from "react-dropzone";
import { useI18n } from "@/i18n";

const VideoPreview = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const { language } = useI18n();

  return (
    <div className="relative aspect-video md:max-h-[600px] h-full">
      <button
        type="button"
        aria-label={language === "ar" ? "حذف الفيديو" : "Remove video"}
        title={language === "ar" ? "حذف الفيديو" : "Remove video"}
        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
        onClick={onRemove}
      >
        <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
      </button>
      <video
        src={URL.createObjectURL(file)}
        controls
        className="border border-border h-full w-full rounded-md object-cover"
      />
    </div>
  );
};

interface IProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  title: string;
  compact?: boolean;
  courseApiCompatible?: boolean;
}

const COURSE_VIDEO_ACCEPT = {
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
  "video/x-ms-wmv": [".wmv"],
};

const VideoUpload = ({
  title,
  file,
  setFile,
  compact = false,
  courseApiCompatible = false,
}: IProps) => {
  const { language } = useI18n();
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  const handleAcceptedFile = (acceptedFiles: File[]) => {
    const nextFile = acceptedFiles[0];
    if (nextFile) {
      setRejectionMessage(null);
      setFile(nextFile);
    }
  };

  const handleRejectedFile = (
    fileRejections: Array<{ errors: Array<{ code: string }> }>
  ) => {
    if (!courseApiCompatible) return;

    const tooLarge = fileRejections.some((rejection) =>
      rejection.errors.some((error) => error.code === "file-too-large")
    );

    setRejectionMessage(
      tooLarge
        ? language === "ar"
          ? "حجم الفيديو يجب ألا يتجاوز 20 ميجابايت."
          : "Video must be 20 MB or smaller."
        : language === "ar"
          ? "الصيغ المدعومة للفيديو: MP4 أو MOV أو AVI أو WMV فقط."
          : "Supported video formats are MP4, MOV, AVI, and WMV only."
    );
  };

  return (
    <div className="w-full max-w-full">
      <Label htmlFor="video" className="cursor-pointer">
        {title}
      </Label>
      <div className="mt-1 w-full space-y-3">
        {file ? (
          <VideoPreview file={file} onRemove={() => setFile(null)} />
        ) : (
          <Dropzone
            onDrop={handleAcceptedFile}
            onDropRejected={handleRejectedFile}
            accept={courseApiCompatible ? COURSE_VIDEO_ACCEPT : { "video/*": [] }}
            maxSize={courseApiCompatible ? 20_000 * 1024 : undefined}
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
                  compact
                    ? "min-h-28 max-h-36 w-full cursor-pointer border-[1.5px] border-main border-dashed flex items-center justify-center rounded-xl focus:outline-none focus:border-primary"
                    : "aspect-video cursor-pointer md:max-h-[600px] h-full border-[1.5px] border-main border-dashed flex items-center justify-center rounded-md focus:outline-none focus:border-primary",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="video" />
                <div className="flex flex-col items-center justify-center gap-2 px-3 text-center">
                  <VideoIcon className={compact ? "h-9 w-9" : "h-16 w-16"} strokeWidth={1.25} />
                  <p className="text-sm font-semibold">{language === "ar" ? "اسحب وأفلت" : "Drag and drop"}</p>
                  {compact ? (
                    <p className="text-xs text-muted-foreground">{language === "ar" ? "أو اضغط لاختيار ملف فيديو" : "Or click to choose a video file"}</p>
                  ) : null}
                </div>
              </div>
            )}
          </Dropzone>
        )}
      </div>
      {rejectionMessage ? (
        <p className="mt-2 text-xs font-semibold text-red-600" role="alert">
          {rejectionMessage}
        </p>
      ) : null}
    </div>
  );
};

export default VideoUpload;
