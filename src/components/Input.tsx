import { useEffect, useState, type ChangeEvent, type FocusEvent, type InputHTMLAttributes } from "react";
import { Card } from "./Card";
import { Tooltip } from "./Tooltip";
import type { ControlProps, Tone } from "../types";
import { FOCUS_RING } from "../tones";

export type InputProps = ControlProps & { tone?: Tone } & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, description, helpText, tone = "accent", value, onChange, onBlur, disabled = false, ...props }: InputProps) {
    const [localValue, setLocalValue] = useState(value?.toString() ?? "");

    useEffect(() => {
        setLocalValue(value?.toString() ?? "");
    }, [value]);

    const handleSave = () => {
        if (onChange && localValue !== value?.toString()) {
            const syntheticEvent = { target: { value: localValue } } as ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
        onBlur?.(undefined as unknown as FocusEvent<HTMLInputElement>);
    };

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
                <input
                    {...props}
                    disabled={disabled}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") {
                            handleSave();
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                    className={`w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none ${FOCUS_RING[tone]} transition-all font-mono text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none leading-[1.5] [-webkit-line-box-contain:glyphs] ${disabled ? "cursor-not-allowed" : ""}`}
                />
            </div>
        </Card>
    );
}
