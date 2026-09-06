import type { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";
import type { Tone } from "../types";
import { BANNER_SOFT, BANNER_SOFT_TEXT, BANNER_SOLID } from "../tones";

export type BannerVariant = "soft" | "solid";

export interface BannerProps {
    children: ReactNode;
    variant?: BannerVariant;
    tone?: Tone;
    icon?: ReactNode;
    progress?: number;
    action?: ReactNode;
}

export function Banner({ children, variant = "soft", tone = "warning", icon, progress, action }: BannerProps) {
    const solid = variant === "solid";
    const surface = solid ? BANNER_SOLID[tone] : BANNER_SOFT[tone];
    const text = solid ? "text-white" : BANNER_SOFT_TEXT[tone];

    return (
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className={`mt-2 ${solid ? "px-5 py-2.5" : "px-4 py-2 shadow-lg"} ${surface} rounded-lg pointer-events-auto flex items-center ${solid ? "gap-2.5" : "gap-2"} animate-fadeIn`}>
                {icon}
                <span className={`${solid ? "text-[0.9rem] font-semibold" : "text-sm font-medium"} ${text}`}>{children}</span>
                {progress !== undefined && (
                    <div className="w-20">
                        <ProgressBar value={progress} tone={tone} size="sm" />
                    </div>
                )}
                {action}
            </div>
        </div>
    );
}
