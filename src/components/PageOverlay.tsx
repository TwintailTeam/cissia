import { useEffect, type ReactNode } from "react";

export interface PageOverlayProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function PageOverlay({ open, onClose, children }: PageOverlayProps) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape" || event.repeat) return;
            onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose]);

    return (
        <div
            className={`absolute inset-0 left-16 z-30 flex flex-col overflow-hidden border-l border-white/10 ${open ? '' : 'pointer-events-none'}`}
            style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                visibility: open ? 'visible' : 'hidden',
                background: 'rgba(0,0,0,0.5)'
            }}
        >
            <div
                className="absolute inset-0 transition-all duration-300 ease-out animate-slideInRight"
                style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.98)',
                    willChange: 'opacity, transform',
                    transitionDelay: open ? '50ms' : '0ms'
                }}
            >
                {children}
            </div>
        </div>
    );
}
