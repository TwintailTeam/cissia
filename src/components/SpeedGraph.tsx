import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { formatSpeed } from "../utils/format";
import type { Tone } from "../types";
import { SPEED_GRAPH_RGB, SPEED_GRAPH_TEXT } from "../tones";

export interface SpeedSample {
    net: number;
    disk: number;
}

export interface SpeedGraphProps {
    history: SpeedSample[];
    slots: number;
    title: string;
    icon: ReactNode;
    netLabel: string;
    diskLabel: string;
    netTone?: Tone;
    diskTone?: Tone;
    titleTone?: Tone;
}

export function SpeedGraph({ history, slots, title, icon, netLabel, diskLabel, netTone = "info", diskTone = "emerald", titleTone }: SpeedGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                setCanvasSize({ width, height });
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || canvasSize.width === 0 || canvasSize.height === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        canvas.width = canvasSize.width * dpr;
        canvas.height = canvasSize.height * dpr;

        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        const width = canvasSize.width;
        const height = canvasSize.height;

        const paddedHistory: SpeedSample[] = [];
        const emptySlots = slots - history.length;
        for (let i = 0; i < emptySlots; i++) {
            paddedHistory.push({ net: 0, disk: 0 });
        }
        paddedHistory.push(...history);

        const minGraphScale = 128 * 1024;
        const maxNet = Math.max(...paddedHistory.map(s => s.net), minGraphScale);
        const maxDisk = Math.max(...paddedHistory.map(s => s.disk), minGraphScale);
        const maxValue = Math.max(maxNet, maxDisk);

        ctx.clearRect(0, 0, width, height);

        const barWidth = width / slots;
        const fadeLeftAlpha = 0.05;
        const fadeRightAlpha = 1.0;
        const fadeExponent = 1.6;

        paddedHistory.forEach((sample, index) => {
            const x = barWidth * index;
            const barHeight = (sample.net / maxValue) * height;
            const y = height - barHeight;

            const actualIndex = index - emptySlots;
            const isHighlighted = hoveredIndex !== null && actualIndex === hoveredIndex;
            const t = index / (slots - 1);
            const tAdjusted = Math.pow(t, fadeExponent);
            const alpha = isHighlighted ? 0.98 : (fadeLeftAlpha + tAdjusted * (fadeRightAlpha - fadeLeftAlpha));

            ctx.fillStyle = `rgba(${SPEED_GRAPH_RGB[netTone]}, ${alpha})`;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });

        const diskGradient = ctx.createLinearGradient(0, 0, width, 0);
        diskGradient.addColorStop(0, `rgba(${SPEED_GRAPH_RGB[diskTone]},0.12)`);
        diskGradient.addColorStop(0.5, `rgba(${SPEED_GRAPH_RGB[diskTone]},0.65)`);
        diskGradient.addColorStop(1, `rgba(${SPEED_GRAPH_RGB[diskTone]},1.0)`);

        ctx.strokeStyle = diskGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        paddedHistory.forEach((sample, index) => {
            const x = barWidth * index + barWidth / 2;
            const y = height - (sample.disk / maxValue) * height;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        if (hoveredIndex !== null && hoveredIndex < history.length) {
            const paddedIndex = emptySlots + hoveredIndex;
            const x = barWidth * paddedIndex + barWidth / 2;
            const sample = history[hoveredIndex]!;
            const y = height - (sample.disk / maxValue) * height;

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${SPEED_GRAPH_RGB[diskTone]}, 0.3)`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${SPEED_GRAPH_RGB[diskTone]})`;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }, [history, hoveredIndex, canvasSize, slots, netTone, diskTone]);

    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const logicalWidth = rect.width;

        const barWidth = logicalWidth / slots;
        const paddedIndex = Math.floor(x / barWidth);

        const emptySlots = slots - history.length;
        const actualIndex = paddedIndex - emptySlots;

        if (actualIndex >= 0 && actualIndex < history.length) {
            setHoveredIndex(actualIndex);
            setMousePos({ x: e.clientX, y: e.clientY });
        } else {
            setHoveredIndex(null);
            setMousePos(null);
        }
    }, [history.length, slots]);

    const handleCanvasMouseLeave = useCallback(() => {
        setHoveredIndex(null);
        setMousePos(null);
    }, []);

    return (
        <>
            {hoveredIndex !== null && mousePos && history[hoveredIndex] && createPortal(
                (() => {
                    const tooltipWidth = 220;
                    const tooltipHeight = 90;
                    const padding = 8;
                    let left = mousePos.x + 20;
                    let top = mousePos.y - tooltipHeight - 8;

                    if (left + tooltipWidth + padding > window.innerWidth) {
                        left = Math.max(padding, mousePos.x - tooltipWidth - 8);
                    }
                    if (top < padding) top = mousePos.y + 8;

                    const sample = history[hoveredIndex]!;
                    return (
                        <div
                            className="fixed z-50 bg-zinc-900/95 border border-white/10 rounded-xl px-3 py-2 shadow-2xl ring-1 ring-white/5 pointer-events-none"
                            style={{ left: `${left}px`, top: `${top}px`, minWidth: tooltipWidth }}
                        >
                            <div className="text-xs space-y-1.5 min-w-[180px]">
                                <div className="border-b border-white/5 pb-1.5 mb-1.5">
                                    <div className={`flex items-center gap-1.5 ${titleTone ? SPEED_GRAPH_TEXT[titleTone] : "text-orange-400"} font-medium`}>
                                        {icon}
                                        <span className="break-all">{title}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`${SPEED_GRAPH_TEXT[netTone]} font-semibold`}>{netLabel}</span>
                                    <span className={`${SPEED_GRAPH_TEXT[netTone]} font-semibold`}>{formatSpeed(sample.net)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`${SPEED_GRAPH_TEXT[diskTone]} font-semibold`}>{diskLabel}</span>
                                    <span className={`${SPEED_GRAPH_TEXT[diskTone]} font-semibold`}>{formatSpeed(sample.disk)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })(),
                document.body
            )}
            <div ref={containerRef} className="w-full h-[140px] overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full cursor-pointer touch-none block"
                    style={{ width: '100%', height: '100%' }}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={handleCanvasMouseLeave}
                />
            </div>
        </>
    );
}
