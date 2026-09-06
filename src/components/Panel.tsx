import type { ReactNode } from "react";
import { CloseIcon } from "../icons";
import { Button } from "./Button";
import { CachedImage } from "./CachedImage";
import type { Tone } from "../types";
import { PANEL_BODY, PANEL_FADE, PANEL_FOOTER, PANEL_SHELL } from "../tones";

export type PanelVariant = "settings" | "popup";
export type PanelSize = "lg" | "md";

const SIZE: Record<PanelSize, string> = {
    lg: "w-[85vw] max-w-7xl h-[80vh]",
    md: "w-[95vw] max-w-4xl h-auto max-h-[90vh]",
};

export interface PanelProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    variant?: PanelVariant;
    tone?: Tone;
    size?: PanelSize;
    banner?: string;
    icon?: string;
    bannerAlt?: string;
    iconAlt?: string;
    imageVersion?: number;
    subtitle?: string;
    subtitleAction?: ReactNode;
    footer?: ReactNode;
    closing?: boolean;
    closeLabel?: string;
}

export function Panel({ title, onClose, children, variant = "settings", tone = "deep", size = "lg", banner, icon, bannerAlt, iconAlt, imageVersion = 0, subtitle, subtitleAction, footer, closing = false, closeLabel }: PanelProps) {
    const shell = PANEL_SHELL[tone];
    const fade = PANEL_FADE[tone];
    const body = PANEL_BODY[tone];
    const footerSurface = PANEL_FOOTER[tone];

    return (
        <div className={`rounded-2xl ${SIZE[size]} ${shell} border border-white/10 flex flex-col overflow-hidden shadow-2xl ${closing ? 'animate-zoom-out' : 'animate-zoom-in'} relative group/settings`}
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>

            {variant === "popup" ? (
                <div className="relative h-48 w-full flex-shrink-0">
                    {banner && (
                        <div className="absolute inset-0 bg-zinc-900">
                            <CachedImage key={`banner-v${imageVersion}`} src={banner} className="w-full h-full object-cover opacity-80" alt={bannerAlt} />
                            <div className={`absolute top-0 left-0 right-0 -bottom-1 bg-gradient-to-b from-black/20 via-black/40 ${fade}`} />
                        </div>
                    )}

                    <div className="absolute top-4 right-4 z-20">
                        <Button variant="round" tone="soft" onClick={onClose} title={closeLabel}
                            className="opacity-0 group-hover/settings:opacity-100">
                            <CloseIcon className="w-6 h-6 text-white/70 group-hover:text-white" />
                        </Button>
                    </div>

                    <div className="absolute bottom-6 left-8 z-10 flex items-end gap-6">
                        {icon && (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black/80 hidden sm:block">
                                <CachedImage key={`icon-v${imageVersion}`} src={icon} className="w-full h-full object-cover" alt={iconAlt} />
                            </div>
                        )}
                        <div className="mb-1">
                            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">{title}</h1>
                            {(subtitle || subtitleAction) && (
                                <div className="flex items-center gap-3 mt-1 relative">
                                    {subtitle && <span className="text-white/80 font-medium text-lg">{subtitle}</span>}
                                    {subtitleAction}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : banner ? (
                <div className="relative h-48 shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-zinc-900">
                        <CachedImage key={`banner-v${imageVersion}`} src={banner} className="w-full h-full object-cover object-center opacity-80" alt={bannerAlt} />
                        <div className={`absolute top-0 left-0 right-0 -bottom-1 bg-gradient-to-b from-black/20 via-black/40 ${fade}`} />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-8 flex items-end justify-between">
                        <div className="flex items-center gap-6">
                            {icon && (
                                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/80 transition-transform duration-500 hover:scale-105">
                                    <CachedImage key={`icon-v${imageVersion}`} src={icon} className="w-full h-full object-cover" alt={iconAlt} />
                                </div>
                            )}
                            <div className="mb-1">
                                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">{title}</h1>
                            </div>
                        </div>
                    </div>

                    <Button variant="round" tone="soft" onClick={onClose} title={closeLabel}
                        className="absolute top-6 right-6 group-hover/settings:opacity-100 opacity-0">
                        <CloseIcon className="w-6 h-6 text-white/70 group-hover:text-white" />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-row items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{title}</h1>
                    <Button variant="round" tone="dim" onClick={onClose} title={closeLabel}
                        className="opacity-0 group-hover/settings:opacity-100">
                        <CloseIcon className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                    </Button>
                </div>
            )}

            {variant === "popup" ? (
                <div className={`flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-8 ${body} scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30`}>
                    {children}
                </div>
            ) : (
                <div className="flex-1 overflow-hidden relative">
                    {children}
                </div>
            )}

            {footer && (
                <div className={`p-6 ${footerSurface} border-t border-white/5 flex flex-col-reverse sm:flex-row justify-end gap-3 z-20`}>
                    {footer}
                </div>
            )}
        </div>
    );
}
