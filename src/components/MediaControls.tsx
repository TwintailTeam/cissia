import { useState, useEffect, useRef } from "react";
import { Button } from "./Button";
import { ChevronLeftIcon, ChevronRightIcon, ImageIcon, PauseIcon, PlayIcon } from "../icons";
import { isVideoUrl } from "../utils/imagePreloader";

export interface MediaOption {
    src: string;
    label: string;
    isDynamic: boolean;
}

export interface MediaControlsProps {
    current: string;
    items: MediaOption[];
    onChange: (src: string) => void;
    visible: boolean;
    mediaElementId: string;
    previousLabel?: string;
    nextLabel?: string;
    staticLabel?: string;
    playLabel?: string;
    pauseLabel?: string;
}

export function MediaControls({ current, items, onChange, visible, mediaElementId, previousLabel, nextLabel, staticLabel, playLabel, pauseLabel }: MediaControlsProps) {
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const hoveredStateRef = useRef(false);
    const currentItem = items.find(item => item.src === current) || items[currentIndex];
    const isDynamic = currentItem?.isDynamic && isVideoUrl(currentItem.src);

    useEffect(() => {
        const index = items.findIndex((item) => item.src === current);
        if (index !== -1) {
            setCurrentIndex(index);
        }
        setIsPaused(false);
    }, [current, items]);

    useEffect(() => {
        if (!visible) return;
        let cancelled = false;
        let retries = 0;

        const applyPlaybackState = () => {
            if (cancelled) return;
            const videoElement = document.getElementById(mediaElementId);
            if (videoElement && videoElement instanceof HTMLVideoElement) {
                if (isPaused) {
                    videoElement.pause();
                } else {
                    videoElement.play().catch(() => { });
                }
                return;
            }
            if (isDynamic && retries < 30) {
                retries++;
                requestAnimationFrame(applyPlaybackState);
            }
        };

        applyPlaybackState();
        return () => { cancelled = true; };
    }, [isPaused, current, isDynamic, visible, mediaElementId]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isOverControls = target.closest('[data-media-controls="true"]') !== null;

            const isOverMedia =
                isOverControls ||
                target.id === mediaElementId ||
                target.closest(".absolute.inset-0.-z-10") !== null ||
                (e.clientX > 64 && !target.closest(".z-40") && !target.closest(".z-50"));

            if (hoveredStateRef.current !== isOverMedia) {
                hoveredStateRef.current = isOverMedia;
                setIsHovered(isOverMedia);
            }
        };

        const handleMouseLeave = () => {
            if (hoveredStateRef.current) {
                hoveredStateRef.current = false;
                setIsHovered(false);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [mediaElementId]);

    const handlePrevious = () => {
        const newIndex = (currentIndex - 1 + items.length) % items.length;
        setCurrentIndex(newIndex);
        setIsPaused(false);
        onChange(items[newIndex]!.src);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(newIndex);
        setIsPaused(false);
        onChange(items[newIndex]!.src);
    };

    const handleTogglePause = () => {
        setIsPaused(!isPaused);
    };

    const hasMultiple = items.length > 1;

    if (!visible || items.length === 0) return null;
    // if (isLinux && !hasMultiple) return null;

    return (
        <div
            data-media-controls="true"
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300 ease-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
        >
            <div className="flex items-center gap-2">
                <Button variant="round" size="sm" onClick={handlePrevious} disabled={!hasMultiple} title={previousLabel}
                    className={hasMultiple ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
                    <ChevronLeftIcon className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-colors" />
                </Button>

                {isDynamic ? (
                    <Button variant="round" size="md" onClick={handleTogglePause} title={isPaused ? playLabel : pauseLabel}>
                        {isPaused
                            ? <PlayIcon className="w-4 h-4 text-white/90 group-hover:text-white transition-colors ml-0.5" />
                            : <PauseIcon className="w-4 h-4 text-white/90 group-hover:text-white transition-colors" />}
                    </Button>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center cursor-default" title={staticLabel}>
                        <ImageIcon className="w-4 h-4 text-white/50" />
                    </div>
                )}

                <Button variant="round" size="sm" onClick={handleNext} disabled={!hasMultiple} title={nextLabel}
                    className={hasMultiple ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
                    <ChevronRightIcon className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-colors" />
                </Button>
            </div>
        </div>
    );
}
