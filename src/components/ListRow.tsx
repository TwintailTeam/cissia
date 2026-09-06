import type { DragEvent, ReactNode } from "react";
import type { Tone } from "../types";
import { LIST_ROW_DOT } from "../tones";

export type ListRowVariant = "panel" | "tile";
export type ListRowDotTone = Tone;

export interface ListRowProps {
    variant?: ListRowVariant;
    title: ReactNode;
    titleHint?: string;
    subtitle?: ReactNode;
    media?: ReactNode;
    leading?: ReactNode;
    actions?: ReactNode;
    dot?: ListRowDotTone;
    dotPulse?: boolean;
    interactive?: boolean;
    draggable?: boolean;
    dragging?: boolean;
    dragOver?: boolean;
    onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
    onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
    onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave?: (event: DragEvent<HTMLDivElement>) => void;
    onDrop?: (event: DragEvent<HTMLDivElement>) => void;
}

export function ListRow({ variant = "tile", title, titleHint, subtitle, media, leading, actions, dot, dotPulse = false, interactive = true, draggable = false, dragging = false, dragOver = false, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop }: ListRowProps) {
    if (variant === "panel") {
        return (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-white/10 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                    {dot && <div className={`w-2 h-2 rounded-full ${LIST_ROW_DOT[dot]} ${dotPulse ? "animate-pulse" : ""}`} />}
                    {leading}
                    <span className="text-white/90 text-sm font-medium">{title}</span>
                </div>
                <div className="flex items-center gap-2">{actions}</div>
            </div>
        );
    }

    const state = dragOver ? 'border-blue-500 bg-blue-900/20' : 'border-white/5 bg-white/5';

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex items-center gap-4 p-3 rounded-lg border ${interactive ? 'transition-all hover:bg-white/10' : ''} ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${dragging ? 'opacity-50 scale-95' : 'opacity-100'} ${state}`}
        >
            {leading}
            {media}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white break-all" title={titleHint}>{title}</h4>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}
