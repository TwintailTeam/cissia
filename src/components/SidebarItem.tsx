import { useEffect, useRef, useState, type ComponentType } from "react";
import { Tooltip } from "./Tooltip";
import { SIDEBAR_ITEM_PALETTE } from "../tones";
import type { Tone } from "../types";

export type SidebarItemVariant = "action" | "queue";

export interface SidebarItemProps {
    icon: ComponentType<{ className?: string }>;
    label: string;
    variant?: SidebarItemVariant;
    tone?: Tone;
    active?: boolean;
    onClick?: () => void;
    tooltipDisabled?: boolean;
    progress?: number;
    queueCount?: number;
    hasActivity?: boolean;
    queueLabel?: (count: number) => string;
}

const RING_CX = 16;
const RING_CY = 20;
const RING_R = 14;
const RING_C = 2 * Math.PI * RING_R;

export function SidebarItem({ icon: Icon, label, variant = "action", tone = "accent", active = false, onClick, tooltipDisabled = false, progress, queueCount = 0, hasActivity = false, queueLabel }: SidebarItemProps) {
    const [iconPop, setIconPop] = useState(false);
    const [addedBurstTick, setAddedBurstTick] = useState(0);
    const prevQueueCountRef = useRef<number | null>(null);
    const iconPopTimeoutRef = useRef<number | null>(null);

    const palette = SIDEBAR_ITEM_PALETTE[tone];
    const ringPercent = progress === undefined ? undefined : Math.max(0, Math.min(100, progress));
    const normalizedQueueCount = Math.max(0, queueCount);
    const showQueueBadge = normalizedQueueCount >= 1;
    const queueBadgeLabel = normalizedQueueCount > 99 ? "99+" : String(normalizedQueueCount);
    const dashOffset = ringPercent !== undefined ? RING_C * (1 - ringPercent / 100) : RING_C;
    const showActivityDot = hasActivity && ringPercent === undefined && !showQueueBadge;
    const iconClass = ringPercent !== undefined ? "w-4 h-5" : "w-8 h-10";
    const burstIconClass = ringPercent !== undefined ? "w-7 h-8" : "w-10 h-12";
    const isQueue = variant === "queue";

    useEffect(() => {
        if (prevQueueCountRef.current === null) {
            prevQueueCountRef.current = normalizedQueueCount;
            return;
        }

        if (normalizedQueueCount > prevQueueCountRef.current) {
            setAddedBurstTick((tick) => tick + 1);
            setIconPop(true);

            if (iconPopTimeoutRef.current !== null) {
                window.clearTimeout(iconPopTimeoutRef.current);
            }

            iconPopTimeoutRef.current = window.setTimeout(() => {
                setIconPop(false);
                iconPopTimeoutRef.current = null;
            }, 200);
        }

        prevQueueCountRef.current = normalizedQueueCount;
    }, [normalizedQueueCount]);

    useEffect(() => {
        return () => {
            if (iconPopTimeoutRef.current !== null) {
                window.clearTimeout(iconPopTimeoutRef.current);
            }
        };
    }, []);

    const state = active ? palette.active : palette.idle;

    return (
        <Tooltip variant="sidebar" text={label} disabled={tooltipDisabled} asChild>
            <div
                className={`${isQueue ? "relative " : ""}flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 ${state} ${iconPop ? "animate-download-attention-pop" : ""} active:scale-95`}
                onClick={onClick}
            >
                {isQueue && ringPercent !== undefined && (
                    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${palette.ringGlow}`} viewBox="0 0 32 40" aria-hidden="true">
                        <circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="currentColor" strokeWidth={3} className="text-white/10" />
                        <circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="currentColor" strokeWidth={3} className={palette.ring} strokeLinecap="round"
                            strokeDasharray={RING_C} strokeDashoffset={dashOffset} transform={`rotate(-90 ${RING_CX} ${RING_CY})`} />
                    </svg>
                )}

                <Icon className={isQueue ? `relative z-10 flex-initial transition-all duration-200 ease-out ${iconClass}` : "w-6 h-6"} />

                {isQueue && addedBurstTick > 0 && (
                    <span key={addedBurstTick} aria-hidden="true" className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <Icon className={`${burstIconClass} ${palette.burst} animate-download-added-burst`} />
                    </span>
                )}

                {isQueue && showQueueBadge && (
                    <span key={`queue-badge-${normalizedQueueCount}-${addedBurstTick}`}
                        className={`absolute -top-1.5 -right-1.5 z-30 min-w-[16px] h-4 px-1 rounded-full ${palette.badge} text-[10px] leading-none font-bold flex items-center justify-center border border-white/20 animate-download-queue-badge-pop`}
                        aria-label={queueLabel?.(normalizedQueueCount)}>
                        {queueBadgeLabel}
                    </span>
                )}

                {isQueue && showActivityDot && (
                    <span className="absolute top-1 right-0.5 z-20 flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${palette.ping} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${palette.pingCore}`} />
                    </span>
                )}
            </div>
        </Tooltip>
    );
}
