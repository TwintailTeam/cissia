import { CloseIcon } from "../icons";

export type StorageBarVariant = "segmented" | "simple";

export interface StorageLegendItem {
    label: string;
    value: string;
}

export interface StorageBarProps {
    label: string;
    hasEnoughSpace: boolean;
    variant?: StorageBarVariant;
    total?: string;
    usedPercent?: number;
    gamePercent?: number;
    used?: StorageLegendItem;
    game?: StorageLegendItem;
    freeAfter?: StorageLegendItem;
    needMoreText?: string;
    fillPercent?: number;
    requiredText?: string;
    freeText?: string;
    insufficientText?: string;
}

export function StorageBar({ label, hasEnoughSpace, variant = "segmented", total, usedPercent = 0, gamePercent = 0, used, game, freeAfter, needMoreText, fillPercent = 0, requiredText, freeText, insufficientText }: StorageBarProps) {
    return (
        <div className="bg-black/20 px-4 pb-4 border-t border-white/5">
            <div className="flex items-center justify-between pt-3 mb-2.5">
                <span className="text-xs text-white/40 uppercase font-bold tracking-wider">{label}</span>
                {total && <span className="text-xs text-white/20 font-mono">{total}</span>}
            </div>
            {variant === "segmented" ? (
                <>
                    <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700" style={{ width: `${Math.min(usedPercent, 100)}%` }} />
                        <div className={`absolute top-0 h-full transition-all duration-700 ${hasEnoughSpace ? 'bg-gradient-to-r from-violet-400 to-purple-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} style={{ left: `${Math.min(usedPercent, 100)}%`, width: `${gamePercent}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-2.5 text-xs gap-x-3 gap-y-1 flex-wrap">
                        {used && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-blue-500/50 shrink-0" />
                                <span className="text-blue-400">{used.label}</span>
                                <span className="text-blue-300 font-medium tabular-nums">{used.value}</span>
                            </div>
                        )}
                        {game && (
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-sm shrink-0 ${hasEnoughSpace ? 'bg-violet-400' : 'bg-red-400'}`} />
                                <span className={hasEnoughSpace ? 'text-purple-300/70' : 'text-red-300/70'}>{game.label}</span>
                                <span className={`font-medium tabular-nums ${hasEnoughSpace ? 'text-purple-300' : 'text-red-400'}`}>{game.value}</span>
                            </div>
                        )}
                        {hasEnoughSpace ? freeAfter && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-emerald-400/50 shrink-0" />
                                <span className="text-emerald-400/70">{freeAfter.label}</span>
                                <span className="text-emerald-400 font-medium tabular-nums">{freeAfter.value}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-red-400">
                                <CloseIcon className="w-[11px] h-[11px]" />
                                <span className="font-medium">{needMoreText}</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${hasEnoughSpace ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.max(2, fillPercent))}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                        <span className={hasEnoughSpace ? 'text-purple-300' : 'text-red-400'}>{requiredText}</span>
                        <span className="text-zinc-500">{freeText}</span>
                    </div>
                    {!hasEnoughSpace && (
                        <p className="text-red-400 text-xs mt-1 font-medium flex items-center gap-1">
                            <CloseIcon className="w-3 h-3" /> {insufficientText}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
