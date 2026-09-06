import type { ComponentType } from "react";
import { CachedImage } from "./CachedImage";

export type InfoOverlayVariant = "info" | "stats";

export interface StatItem {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string;
}

export interface InfoOverlayProps {
    variant?: InfoOverlayVariant;
    visible: boolean;
    title?: string;
    icon?: string;
    iconAlt?: string;
    subtitle?: string;
    badge?: string;
    items?: StatItem[];
    imageVersion?: number;
}

const CARD = "rounded-xl border border-white/10 bg-black/50 shadow-lg";

export function InfoOverlay({ variant = "info", visible, title, icon, iconAlt, subtitle, badge, items = [], imageVersion = 0 }: InfoOverlayProps) {
    if (!visible) return null;

    if (variant === "stats") {
        return (
            <div className="absolute top-4 right-6 z-20 animate-slideInRight pointer-events-none" style={{ animationDelay: "120ms" }}>
                <div className={CARD}>
                    <div className="flex items-stretch divide-x divide-white/10">
                        {items.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="px-3 py-2.5 min-w-[175px]">
                                <div className="flex items-center gap-2.5">
                                    <Icon className="w-5 h-5 text-white/55 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{label}</div>
                                        <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!title) return null;

    return (
        <div className="absolute bottom-8 left-24 max-w-md animate-slideUp z-10" style={{ animationDelay: '200ms' }}>
            <div className={`${CARD} p-4`}>
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                            <CachedImage key={`icon-v${imageVersion}`} src={icon} className="w-full h-full object-cover" alt={iconAlt} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            {subtitle && <span className="text-sm text-white/50">{subtitle}</span>}
                            {badge && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-400 text-xs font-medium border border-purple-500/30 shadow-[0_0_8px_rgba(147,51,234,0.2)]">
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
