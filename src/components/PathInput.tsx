import { useEffect, useState } from "react";
import { FolderOpenIcon } from "../icons";
import { Button } from "./Button";
import { Card } from "./Card";
import { Tooltip } from "./Tooltip";
import type { ControlProps, Tone } from "../types";
import { FOCUS_RING } from "../tones";

export interface PathInputProps extends ControlProps {
    value: string;
    onChange: (val: string) => void;
    folder?: boolean;
    extensions?: string[];
    disabled?: boolean;
    onBrowse?: (opts: { folder: boolean, extensions?: string[] }) => Promise<string | null>;
    tone?: Tone;
}

export function PathInput({ label, description, helpText, tone = "accent", value, onChange, folder = true, extensions, disabled = false, onBrowse }: PathInputProps) {
    const [localValue, setLocalValue] = useState(value ?? "");

    useEffect(() => {
        setLocalValue(value ?? "");
    }, [value]);

    const handleSave = () => {
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    const handleBrowse = async () => {
        if (!onBrowse) return;
        const selected = await onBrowse({ folder, extensions });
        if (selected) {
            setLocalValue(selected);
            onChange(selected);
        }
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
                <div className="flex gap-2">
                    <input
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
                        className={`flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none ${FOCUS_RING[tone]} transition-all font-mono text-sm truncate leading-[1.5] [-webkit-line-box-contain:glyphs] ${disabled ? "cursor-not-allowed" : ""}`}
                    />
                    <Button variant="browse" disabled={disabled} onClick={handleBrowse} className={disabled ? "cursor-not-allowed" : ""}>
                        <FolderOpenIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
