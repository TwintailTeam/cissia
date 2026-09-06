import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "../icons";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";
import type { SelectOption } from "./Select";
import type { Tone } from "../types";
import { DROPDOWN_CHEVRON, DROPDOWN_LABEL } from "../tones";

export type DropdownVariant = Exclude<ButtonVariant, "hero" | "overlayChip">;

export interface DropdownProps {
    value: string;
    options: SelectOption[];
    onChange: (option: SelectOption) => void;
    variant?: DropdownVariant;
    tone?: Tone;
    size?: ButtonSize;
}

export function Dropdown({ value, options, onChange, variant = "chip", tone = "normal", size = "sm" }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const label = variant === "chip" ? DROPDOWN_LABEL[tone] : "";
    const chevron = variant === "chip" ? DROPDOWN_CHEVRON[tone] : "text-current opacity-70";

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant={variant} tone={tone} size={size} onClick={() => setOpen(!open)}>
                <span className="inline-flex items-center gap-2 whitespace-nowrap align-middle">
                    <span className={`${label} font-bold text-sm`}>{value}</span>
                    <ChevronDownIcon className={`w-3.5 h-3.5 shrink-0 ${chevron} transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </span>
            </Button>
            {open && (
                <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                    {options.map((option) => (
                        <button key={option.value} onClick={() => { setOpen(false); onChange(option); }}
                            className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center justify-between group">
                            <span className={`text-sm ${value === option.value ? 'text-white font-bold' : 'text-zinc-400 group-hover:text-white'}`}>
                                {option.name ?? option.label ?? option.value}
                            </span>
                            {value === option.value && <CheckIcon className={`w-3.5 h-3.5 ${DROPDOWN_CHEVRON[tone]}`} aria-hidden="true" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
