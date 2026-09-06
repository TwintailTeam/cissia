import type { ComponentType, ReactNode } from "react";
import { ArrowLeftIcon } from "../icons";
import { Button } from "./Button";
import type { Tone } from "../types";
import { PAGE_HEADER_BADGE, PAGE_HEADER_ICON } from "../tones";

export type PageHeaderTone = Tone;

export interface PageHeaderProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    subtitle?: ReactNode;
    tone?: PageHeaderTone;
    onBack: () => void;
    backLabel?: string;
}

export function PageHeader({ icon: Icon, title, subtitle, tone = "accent", onBack, backLabel }: PageHeaderProps) {
    return (
        <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5">
            <Button variant="surface" size="md" tone={tone === "info" ? "info" : "normal"} onClick={onBack} title={backLabel}>
                <ArrowLeftIcon className="w-5 h-5 text-white/70" />
            </Button>
            <div className="flex items-center gap-4">
                <div className={PAGE_HEADER_BADGE[tone]}>
                    <Icon className={PAGE_HEADER_ICON[tone]} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{title}</h1>
                    {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}
