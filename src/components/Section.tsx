import type { ReactNode } from "react";

export type SectionVariant = "page" | "popup";

export interface SectionProps {
    title: string;
    children: ReactNode;
    variant?: SectionVariant;
    icon?: ReactNode;
}

export function Section({ title, children, variant = "page", icon }: SectionProps) {
    if (variant === "popup") {
        return (
            <div className="space-y-4">
                <h3 className="text-white/90 font-semibold text-lg flex items-center gap-2">
                    {icon} {title}
                </h3>
                {children}
            </div>
        );
    }

    return (
        <div className="mb-10 animate-fadeIn">
            <h2 className="text-lg font-semibold text-white/90 mb-4 px-1">{title}</h2>
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </div>
    );
}
