export type Tone =
    | "normal" | "accent" | "info" | "success" | "warning" | "caution" | "danger"
    | "muted" | "soft" | "deep" | "dim" | "discord" | "gloss" | "pink" | "emerald";

export interface ControlProps {
    label: string;
    description?: string;
    helpText?: string;
    descriptionClassName?: string;
}
