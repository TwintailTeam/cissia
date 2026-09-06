import type { ReactNode } from "react";
import { AlertCircleIcon, CloseIcon, HelpIcon, InfoIcon, WarningIcon } from "../icons";
import { Button, type ButtonTone } from "./Button";

export type DialogType = "error" | "warning" | "info" | "confirm";

export interface DialogButton {
    label: string;
    variant?: "primary" | "secondary" | "danger";
    onClick?: () => void;
    preventClose?: boolean;
}

export interface DialogProps {
    type: DialogType;
    title: string;
    message: string;
    buttons: DialogButton[];
    isClosing?: boolean;
    onButtonClick: (index: number) => void;
    onClose: () => void;
}

const iconMap: Record<DialogType, ReactNode> = {
    error: <AlertCircleIcon className="w-8 h-8 text-red-500" />,
    warning: <WarningIcon className="w-8 h-8 text-amber-500" />,
    info: <InfoIcon className="w-8 h-8 text-blue-400" />,
    confirm: <HelpIcon className="w-8 h-8 text-purple-400" />,
};

const titleGradientMap: Record<DialogType, string> = {
    error: "from-white to-red-200",
    warning: "from-white to-amber-200",
    info: "from-white to-blue-200",
    confirm: "from-white to-purple-200",
};

const toneMap: Record<NonNullable<DialogButton["variant"]>, ButtonTone> = {
    primary: "accent",
    danger: "danger",
    secondary: "normal",
};

export function Dialog({ type, title, message, buttons, isClosing = false, onButtonClick, onClose }: DialogProps) {
    return (
        <div className={`rounded-2xl w-[90vw] max-w-lg bg-[#0c0c0c] border border-white/10 flex flex-col p-6 overflow-hidden shadow-2xl ${isClosing ? "animate-zoom-out" : "animate-zoom-in"}`}>
            <div className="flex flex-row items-center justify-between mb-4">
                <div className="flex flex-row items-center gap-4">
                    <div className="p-2 rounded-xl bg-white/5">{iconMap[type]}</div>
                    <h2 className={`text-white font-bold text-xl bg-gradient-to-r ${titleGradientMap[type]} bg-clip-text text-transparent`}>{title}</h2>
                </div>
                <Button variant="icon" size="md" onClick={onClose}><CloseIcon className="w-5 h-5" /></Button>
            </div>

            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 mb-4">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            </div>

            <div className="flex justify-end gap-3">
                {buttons.map((button, index) => (
                    <Button key={index} variant="action" tone={toneMap[button.variant ?? "secondary"]}
                        onClick={() => {
                            if (button.onClick) button.onClick();
                            if (!button.preventClose) onButtonClick(index);
                        }}>
                        {button.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
