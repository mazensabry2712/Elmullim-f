import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  description: { text: string; color?: string };
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  isLoading?: boolean;
  showFooter?: boolean;
  variant?: "default" | "destructive" | "ghost" | "outline" | "secondary";
}

const Modal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  onCancel,
  onConfirm,
  confirmText,
  isLoading = false,
  showFooter = true,
  variant,
}: IProps) => {
  const { language } = useI18n();
  const cancelText = language === "ar" ? "إلغاء" : "Cancel";
  const resolvedConfirmText = confirmText ?? (language === "ar" ? "تأكيد" : "Confirm");

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="relative !z-[1000] rounded-lg border border-slate-200 shadow-xl"
        style={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
          width: "min(32rem, calc(100vw - 2rem))",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          onClick={onOpenChange}
          aria-label={language === "ar" ? "إغلاق" : "Close"}
          className="absolute end-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-black-blue/70 transition-colors hover:bg-black-blue/5 hover:text-black-blue focus:outline-none focus:ring-2 focus:ring-main disabled:pointer-events-none disabled:opacity-50"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black-blue text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className={`text-center max-w-sm mx-auto font-sora ${description.color ?? ""}`}>
            {description.text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        {showFooter && (
          <AlertDialogFooter className="text-start gap-2">
            <AlertDialogCancel onClick={onCancel} className="text-black-blue py-2.5 h-auto">
              {cancelText}
            </AlertDialogCancel>
            {onConfirm && (
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={`py-2.5 h-auto ${variant ? "" : "bg-main hover:bg-main/90"}`}
                variant={variant}
              >
                {isLoading && <Loader2 className="animate-spin ml-2" />}
                {resolvedConfirmText}
              </Button>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
