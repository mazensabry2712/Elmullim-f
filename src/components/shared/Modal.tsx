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
import { Loader2 } from "lucide-react";
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
      <AlertDialogContent className="border-muted !z-[1000] rounded-lg">
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
