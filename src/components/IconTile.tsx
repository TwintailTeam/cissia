import { useRef, type MouseEvent } from "react";
import { Tooltip } from "./Tooltip";
import type { Tone } from "../types";
import { ICON_TILE_PALETTE } from "../tones";

export type IconTileVariant = "install" | "manifest" | "floating";

export interface IconTileProps {
    icon: string;
    name: string;
    id?: string;
    variant?: IconTileVariant;
    tone?: Tone;
    sizeClass?: string;
    enabled?: boolean;
    disabled?: boolean;
    hasUpdate?: boolean;
    tooltipDisabled?: boolean;
    onSelect?: () => void;
    onContextMenu?: (event: MouseEvent) => void;
    index?: number;
    onDragStart?: (index: number) => void;
    onDragEnd?: () => void;
    onDragOver?: (index: number) => void;
    onDrop?: (index: number) => void;
    isDragging?: boolean;
    isDragTarget?: boolean;
}

export function IconTile({ icon, name, id, variant = "install", tone = "accent", sizeClass = "w-12", enabled = true, disabled = false, hasUpdate = false, tooltipDisabled = false, onSelect, onContextMenu, index, onDragStart, onDragEnd, onDragOver, onDrop, isDragging = false, isDragTarget = false }: IconTileProps) {
    const imageRef = useRef<HTMLImageElement>(null);
    const palette = ICON_TILE_PALETTE[tone];

    if (!enabled) return null;

    if (variant !== "install") {
        const decor = variant === "floating"
            ? `p-1 bg-white/5 ring-1 ring-white/10 focus:ring-2 shadow-md transition-all duration-200 ${palette.ring}`
            : `hover:border-2 focus:border-2 ${palette.frame}`;

        return (
            <Tooltip variant="sidebar" side="bottom" distance={10} text={name} disabled={tooltipDisabled} asChild portal>
                <img
                    ref={imageRef}
                    id={id}
                    className={`aspect-square ${sizeClass} rounded-lg cursor-pointer outline-none ${decor}`}
                    loading="lazy"
                    decoding="async"
                    src={icon}
                    tabIndex={0}
                    draggable={false}
                    onClick={() => {
                        onSelect?.();
                        imageRef.current?.focus();
                    }}
                    alt={"?"}
                />
            </Tooltip>
        );
    }

    const edgeIndex = (event: { currentTarget: HTMLElement, clientY: number }) => {
        const rect = event.currentTarget.getBoundingClientRect();
        return event.clientY > rect.top + rect.height / 2 ? index! + 1 : index!;
    };

    return (
        <div
            className="relative flex flex-col items-center"
            style={{ width: 48, minWidth: 48 }}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (index !== undefined && onDragOver) onDragOver(edgeIndex(e));
            }}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (index !== undefined && onDrop) onDrop(edgeIndex(e));
            }}
        >
            <div className={`w-12 flex items-center justify-center transition-all duration-200 ease-out overflow-hidden pointer-events-none ${isDragTarget ? 'h-14 mb-1' : 'h-0'}`}>
                {isDragTarget && (
                    <div className={`w-12 h-12 rounded-lg border-2 border-dashed ${palette.drop} flex items-center justify-center animate-pulse`}>
                        <div className={`w-6 h-0.5 rounded-full ${palette.dropInner}`} />
                    </div>
                )}
            </div>

            <Tooltip variant="sidebar" text={name} disabled={tooltipDisabled} asChild portal>
                <div
                    className={`relative w-12 h-12 flex-shrink-0 transition-opacity duration-150 ${isDragging ? 'opacity-25' : 'opacity-100'}`}
                    draggable={index !== undefined && onDragStart !== undefined}
                    onDragStart={(e) => {
                        if (index !== undefined && onDragStart) {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', index.toString());
                            setTimeout(() => onDragStart(index), 0);
                        }
                    }}
                    onDragEnd={() => {
                        if (onDragEnd) onDragEnd();
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (index !== undefined && onDragOver) onDragOver(index);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (index !== undefined && onDrop) onDrop(index);
                    }}
                >
                    <img
                        ref={imageRef}
                        id={id}
                        className={`block w-full h-full rounded-lg cursor-pointer hover:border-2 focus:border-2 ${palette.frame} outline-none disabled:cursor-not-allowed disabled:border-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        loading="lazy"
                        decoding="async"
                        src={icon}
                        tabIndex={0}
                        draggable={false}
                        onContextMenu={onContextMenu}
                        onClick={() => {
                            if (disabled) return;
                            onSelect?.();
                            setTimeout(() => { imageRef.current?.focus({ preventScroll: true }); }, 0);
                        }}
                        alt={"?"}
                    />
                    {hasUpdate ? (
                        <span className="pointer-events-none absolute top-0.5 right-0.5 z-20 flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${palette.ping} opacity-90`} />
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${palette.pingCore}`} />
                        </span>
                    ) : null}
                </div>
            </Tooltip>
        </div>
    );
}
