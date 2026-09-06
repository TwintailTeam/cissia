import type { ComponentType } from "react";
import type { Tone } from "../types";
import { STAT_TILE_GLYPH, STAT_TILE_VALUE } from "../tones";

export type StatTileVariant = "cell" | "glyph";
export type StatGlyph = "bars" | "line";

export interface StatTileCellProps {
    label: string;
    value: string;
    variant?: "cell";
    icon?: ComponentType<{ className?: string }>;
}

export interface StatTileGlyphProps {
    label: string;
    value: string;
    variant: "glyph";
    glyph?: StatGlyph;
    tone?: Tone;
}

export type StatTileProps = StatTileCellProps | StatTileGlyphProps;

export function StatTile(props: StatTileProps) {
    const { label, value } = props;

    if (props.variant === "glyph") {
        const { glyph = "bars", tone = "info" } = props;
        const glyphColor = STAT_TILE_GLYPH[tone];
        const valueColor = STAT_TILE_VALUE[tone];

        return (
            <div className="flex flex-col text-xs">
                <div className="flex items-center gap-2 text-gray-400 uppercase tracking-wider">
                    {glyph === "bars" ? (
                        <div className="flex items-end gap-0.5 h-3">
                            <div className={`w-0.5 h-1.5 ${glyphColor} rounded-sm`} />
                            <div className={`w-0.5 h-2.5 ${glyphColor} rounded-sm`} />
                            <div className={`w-0.5 h-2 ${glyphColor} rounded-sm`} />
                        </div>
                    ) : (
                        <div className="flex items-center h-3">
                            <div className={`w-3 h-0.5 ${glyphColor} rounded-full`} />
                        </div>
                    )}
                    <span>{label}</span>
                </div>
                <div className={`text-sm font-medium ${valueColor} mt-1`}>{value}</div>
            </div>
        );
    }

    const Icon = props.icon;

    return (
        <div className="px-3 py-2.5 min-w-[175px]">
            <div className="flex items-center gap-2.5">
                {Icon && <Icon className="w-5 h-5 text-white/55 flex-shrink-0" />}
                <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{label}</div>
                    <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
                </div>
            </div>
        </div>
    );
}
