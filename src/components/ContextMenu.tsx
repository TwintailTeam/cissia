import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { Tone } from "../types";
import { CONTEXT_MENU_ITEM, CONTEXT_MENU_TEXT } from "../tones";

export type ContextMenuTone = Tone;
export type ContextMenuTextTone = Tone;

export type ContextMenuEntry =
    | { kind?: "item", icon: ComponentType<{ className?: string }>, label: string, onClick: () => void, tone?: ContextMenuTone }
    | { kind: "separator" }
    | { kind: "text", label: string, tone?: ContextMenuTextTone };

export interface ContextMenuProps {
    x: number;
    y: number;
    items: ContextMenuEntry[];
    onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x, y });

    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let adjustedX = x;
            let adjustedY = y;

            if (x + rect.width > viewportWidth) {
                adjustedX = viewportWidth - rect.width - 10;
            }

            if (y + rect.height > viewportHeight) {
                adjustedY = viewportHeight - rect.height - 10;
            }

            setPosition({ x: adjustedX, y: adjustedY });
        }
    }, [x, y]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return createPortal(
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
            className="fixed z-[9999] bg-zinc-900/95 border border-white/10 rounded-xl shadow-2xl min-w-[200px] overflow-hidden ring-1 ring-white/5 origin-top-left"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <div className="py-2">
                {items.map((entry, index) => {
                    if (entry.kind === "separator") {
                        return <div key={index} className="h-px bg-white/5 my-1 mx-2" />;
                    }

                    if (entry.kind === "text") {
                        return <div key={index} className={CONTEXT_MENU_TEXT[entry.tone ?? "muted"]}>{entry.label}</div>;
                    }

                    const Icon = entry.icon;

                    return (
                        <button
                            key={index}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${CONTEXT_MENU_ITEM[entry.tone ?? "normal"]} text-sm font-medium rounded-lg mx-1 my-0.5 w-[calc(100%-8px)]`}
                            onClick={() => {
                                entry.onClick();
                                onClose();
                            }}
                        >
                            <Icon className="w-5 h-5 stroke-[1.5]" />
                            <span>{entry.label}</span>
                        </button>
                    );
                })}
            </div>
        </motion.div>,
        document.body
    );
}
