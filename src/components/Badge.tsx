import type { ReactNode } from "react";
import type { Tone } from "../types";
import { BADGE_BARE, BADGE_CHIP, BADGE_PROGRESS_BORDER, BADGE_PROGRESS_FILL, BADGE_PROGRESS_TEXT } from "../tones";

export type BadgeVariant = "chip" | "progress" | "bare";
export type BadgeTone = Tone;

export interface BadgeProps {
    variant?: BadgeVariant;
    tone?: BadgeTone;
    icon?: ReactNode;
    children: ReactNode;
    progress?: number;
}

export function Badge({ variant = "chip", tone = "success", icon, children, progress = 0 }: BadgeProps) {
    if (variant === "progress") {
        const border = BADGE_PROGRESS_BORDER[tone];
        const fill = BADGE_PROGRESS_FILL[tone];
        const text = BADGE_PROGRESS_TEXT[tone];

        return (
            <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border ${border} overflow-hidden`}>
                <div className={`absolute inset-0 ${fill} transition-all duration-300 ease-out`} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                {icon && <span className="relative">{icon}</span>}
                <span className={`relative text-xs font-medium ${text}`}>{children}</span>
            </div>
        );
    }

    return (
        <div className={variant === "bare" ? BADGE_BARE[tone] : BADGE_CHIP[tone]}>
            {icon}
            <span>{children}</span>
        </div>
    );
}
