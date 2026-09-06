import type { ReactNode } from "react";

export type EmptyStateVariant = "page" | "inline";

export interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    variant?: EmptyStateVariant;
}

export function EmptyState({ title, description, icon, variant = "page" }: EmptyStateProps) {
    if (variant === "inline") {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-sm">{title}</p>
            </div>
        );
    }

    return (
        <div className="p-12 text-center text-gray-500">
            {icon}
            <p className="text-lg">{title}</p>
            {description && <p className="text-sm mt-2 text-gray-600">{description}</p>}
        </div>
    );
}
