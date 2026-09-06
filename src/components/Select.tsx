import { ChevronDownIcon } from "../icons";
import { Card } from "./Card";
import { Tooltip } from "./Tooltip";
import type { ControlProps, Tone } from "../types";
import { FOCUS_RING } from "../tones";

export interface SelectOption {
    value: string;
    label?: string;
    name?: string;
}

export interface SelectProps extends ControlProps {
    value: string;
    onChange: (val: string) => void;
    options: SelectOption[];
    disabled?: boolean;
    tone?: Tone;
}

export function Select({ label, description, helpText, tone = "accent", options, value, onChange, disabled = false }: SelectProps) {
    return (
        <Card className={disabled ? "cursor-not-allowed opacity-70" : ""}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <label className={`text-base font-medium ${disabled ? "text-zinc-200" : "text-white"}`}>{label}</label>
                        {helpText && <Tooltip variant="rich" text={helpText} />}
                    </div>
                    {description && <span className="text-sm text-zinc-400">{description}</span>}
                </div>
                <div className="relative">
                    <select
                        value={value}
                        disabled={disabled}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full appearance-none bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none ${FOCUS_RING[tone]} transition-all ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                                {opt.label ?? opt.name ?? opt.value}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
            </div>
        </Card>
    );
}
