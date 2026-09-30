import { ButtonHTMLAttributes } from "react";
import { Button } from "../../ui/button";
import { LoaderCircle } from "lucide-react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isLoading: boolean;
}

const SubmitAuthButton = ({
  title,
  isLoading,
  className,
  ...rest
}: IProps) => {
  const { language } = useI18n();
  const translatedTitle =
    language === "ar" && title.toLowerCase() === "login"
      ? "تسجيل الدخول"
      : title;

  return (
    <Button
      type="submit"
      {...rest}
      disabled={isLoading}
      className={cn(
        "w-full h-auto bg-main hover:bg-main text-white py-2 font-sora font-light text-lg capitalize flex justify-center items-center gap-2",
        className
      )}
    >
      {isLoading && (
        <span className="flex-shrink-0 w-6">
          <LoaderCircle className="animate-spin !w-6 !h-6" />
        </span>
      )}
      <span className="flex justify-center items-center gap-2">
        {translatedTitle}
        <i className="fi fi-bs-sign-in-alt text-lg text-white mt-2 ms-2" />
      </span>
    </Button>
  );
};

export default SubmitAuthButton;
