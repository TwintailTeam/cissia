import { useEffect, type ReactNode } from "react";

export interface PopupOverlayProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function PopupOverlay({ open, onClose, children }: PopupOverlayProps) {
    useEffect(() => {
        if (open) {
            const onKey = (e: KeyboardEvent) => {
                if (e.key === "Escape") onClose();
            };
            document.addEventListener("keydown", onKey);
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.removeEventListener("keydown", onKey);
                document.body.style.overflow = prevOverflow;
            };
        }
    }, [open, onClose]);

    return (
        <div
            role="dialog"
            aria-modal={open}
            className={`absolute items-center justify-center top-0 bottom-0 left-16 right-0 p-8 z-50 flex ${open ? "animate-backdrop-in" : "pointer-events-none"}`}
            style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                visibility: open ? 'visible' : 'hidden',
                opacity: open ? 1 : 0,
                background: 'rgba(0,0,0,0.6)'
            }}
            onClick={(e) => { if (e.target === e.currentTarget) { onClose(); } }}
        >
            <div>
                {children}
            </div>
        </div>
    );
}
