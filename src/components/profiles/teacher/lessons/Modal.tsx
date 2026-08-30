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

interface IProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  description: {
    text: string;
    color?: string;
  };
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
  confirmText = "confirm",
  isLoading = false,
  showFooter = true,
  variant,
}: IProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-muted !z-[1000] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black-blue text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={`text-center max-w-sm mx-auto font-sora ${
              description.color ? description.color : ""
            }`}
          >
            {description.text}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children}

        {showFooter && (
          <AlertDialogFooter className="text-start gap-2">
            <AlertDialogCancel
              onClick={onCancel}
              className="text-black-blue py-2.5 h-auto"
            >
              Cancel
            </AlertDialogCancel>
            {onConfirm && (
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={`py-2.5 h-auto ${
                  variant ? "" : "bg-main hover:bg-main/90"
                }`}
                variant={variant}
              >
                {isLoading && <Loader2 className="animate-spin ml-2" />}
                {confirmText}
              </Button>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
