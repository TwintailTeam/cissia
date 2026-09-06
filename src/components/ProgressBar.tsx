import type { Tone } from "../types";
import { PROGRESS_FILL, PROGRESS_TRACK } from "../tones";

export type ProgressTone = Tone;
export type ProgressSize = "sm" | "md";

export interface ProgressBarProps {
    value: number;
    tone?: ProgressTone;
    size?: ProgressSize;
    minWidth?: number;
}

const HEIGHT: Record<ProgressSize, string> = { sm: "h-1.5", md: "h-2" };

export function ProgressBar({ value, tone = "info", size = "md", minWidth = 0 }: ProgressBarProps) {
    return (
        <div className={`relative w-full ${HEIGHT[size]} ${PROGRESS_TRACK[tone]} rounded-full overflow-hidden`}>
            <div className={`absolute top-0 left-0 h-full rounded-full ${PROGRESS_FILL[tone]}`} style={{ width: `${Math.max(minWidth, Math.min(100, value))}%` }}>
                {tone === "gloss" && <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/30 to-transparent" />}
            </div>
        </div>
    );
}
