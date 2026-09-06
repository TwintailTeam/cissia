import type { ReactNode } from "react";

export interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
    return (
        <div className={`bg-zinc-900/85 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors ${className}`} onClick={onClick}>
            {children}
        </div>
    );
}
