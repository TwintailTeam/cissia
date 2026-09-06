import { useEffect, useState } from "react";
import { Dialog, type DialogButton, type DialogType } from "./Dialog";

export interface DialogOverlayProps {
    open: boolean;
    type: DialogType;
    title: string;
    message: string;
    buttons: DialogButton[];
    onClose: (index: number) => void;
}

export function DialogOverlay({ open, type, title, message, buttons, onClose }: DialogOverlayProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose(0);
        }, 200);
    };

    const handleButtonClick = (index: number) => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose(index);
        }, 200);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal={true}
            className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="absolute inset-0 bg-black/80" />

            <div className="relative z-10">
                <Dialog
                    type={type}
                    title={title}
                    message={message}
                    buttons={buttons}
                    isClosing={isClosing}
                    onButtonClick={handleButtonClick}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
}
