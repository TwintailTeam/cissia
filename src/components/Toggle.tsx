import type { ComponentType } from "react";
import { Card } from "./Card";
import { Tooltip } from "./Tooltip";
import type { Tone } from "../types";
import { TOGGLE_LABEL_HOVER, TOGGLE_PING, TOGGLE_PING_CORE, TOGGLE_TRACK_ON, TOGGLE_TRACK_ON_DISABLED } from "../tones";

export type ToggleVariant = "switch" | "icon";

type Glyph = ComponentType<{ className?: string, "aria-hidden"?: boolean }>;

export interface ToggleProps {
    variant?: ToggleVariant;
    checked: boolean;
    onChange: (val: boolean) => void;
    tone?: Tone;
    label?: string;
    description?: string;
    helpText?: string;
    descriptionClassName?: string;
    disabled?: boolean;
    icon?: Glyph;
    checkedIcon?: Glyph;
    hint?: boolean;
    id?: string;
}

export function Toggle({ variant = "switch", checked, onChange, tone = "accent", label, description, helpText, descriptionClassName, disabled = false, icon: Icon, checkedIcon: CheckedIcon, hint = false, id }: ToggleProps) {
    const interactive = !disabled;

    if (variant === "icon") {
        return (
            <div
                id={id}
                className="group text-white hover:text-white/55 w-8 h-16 mb-0 cursor-pointer flex-initial relative flex items-center justify-center"
                onClick={interactive ? () => onChange(!checked) : undefined}>
                <span className="absolute inset-0 flex items-center justify-center">
                    {Icon && <Icon className={`w-8 h-10 transition-all duration-300 ease-out ${checked ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} aria-hidden={true} />}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                    {CheckedIcon && <CheckedIcon className={`w-8 h-10 transition-all duration-300 ease-out ${checked ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`} aria-hidden={true} />}
                </span>

                {hint && !checked && (
                    <span className="absolute top-4 right-0.5 flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${TOGGLE_PING[tone]} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${TOGGLE_PING_CORE[tone]}`} />
                    </span>
                )}
            </div>
        );
    }

    return (
        <Card
            className={`flex flex-row items-center justify-between ${interactive ? "group cursor-pointer" : "cursor-not-allowed opacity-70"}`}
            onClick={interactive ? () => onChange(!checked) : undefined}
        >
            <div className="flex flex-col gap-1 pr-4">
                <div className="flex items-center gap-2">
                    <label className={`text-base font-medium transition-colors pointer-events-none ${interactive ? `text-white ${TOGGLE_LABEL_HOVER[tone]}` : "text-zinc-200"}`}>{label}</label>
                    {helpText && <div onClick={e => e.stopPropagation()}><Tooltip variant="rich" text={helpText} /></div>}
                </div>
                {description && <span className={`text-sm pointer-events-none ${descriptionClassName ?? "text-zinc-400"}`}>{description}</span>}
            </div>

            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (!interactive) return;
                    onChange(!checked);
                }}
                className={`
                    w-12 h-7 rounded-full transition-all duration-300 relative flex items-center shadow-inner
                    ${interactive ? "cursor-pointer" : "cursor-not-allowed"}
                    ${checked ? (interactive ? TOGGLE_TRACK_ON[tone] : TOGGLE_TRACK_ON_DISABLED[tone]) : "bg-zinc-800"}
                `}>
                <div className={`
                    w-5 h-5 rounded-full shadow-md transform transition-all duration-300 absolute
                    ${interactive ? "bg-white" : "bg-zinc-300"}
                    ${checked ? "translate-x-6" : "translate-x-1"}
                `} />
            </div>
        </Card>
    );
}
