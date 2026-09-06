import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Tone } from "../types";
import { BUTTON_STYLES } from "../tones";

export type ButtonVariant =
    | "action" | "icon" | "round" | "surface" | "tile" | "chip"
    | "small" | "block" | "outline" | "ghost" | "link" | "browse"
    | "hero" | "overlayChip";

export type ButtonTone = Tone;

export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    tone?: ButtonTone;
    size?: ButtonSize;
    shimmer?: boolean;
    children?: ReactNode;
}

export function Button({ variant = "action", tone = "normal", size = "md", shimmer = false, className = "", children, ...props }: ButtonProps) {
    const table = BUTTON_STYLES[variant];
    const base = typeof table === "string"
        ? table
        : table[`${size}:${tone}`] ?? table[tone] ?? table[`${size}:normal`] ?? table.normal!;

    return (
        <button {...props} className={className ? `${base} ${className}` : base}>
            {shimmer && <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />}
            {children}
        </button>
    );
}
