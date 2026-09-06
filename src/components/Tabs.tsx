import { useEffect, useRef, useState, type ComponentType } from "react";
import type { Tone } from "../types";
import { TABS_COLORS } from "../tones";

export type TabColor = Tone;

export interface Tab {
    id: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    color: Tone;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 48 });
    const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const activeElement = tabsRef.current[activeTab];
            if (activeElement) {
                setIndicatorStyle({ top: activeElement.offsetTop, height: activeElement.offsetHeight });
            }
        });

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [activeTab, tabs]);

    const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
    const styles = TABS_COLORS[activeTabObj?.color ?? "normal"];

    return (
        <div className="w-64 flex-shrink-0 h-full border-r border-white/5 bg-transparent p-4 flex flex-col gap-2 overflow-y-auto scrollbar-none relative">
            <div className={`absolute left-4 right-4 rounded-xl transition-all duration-300 ease-out pointer-events-none will-change-transform ${styles.glow}`}
                style={{ top: indicatorStyle.top, height: indicatorStyle.height, width: 'calc(100% - 2rem)' }}>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-300 will-change-transform ${styles.accent} ${styles.shadow}`} />
            </div>

            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                const tabStyles = TABS_COLORS[tab.color];

                return (
                    <button
                        key={tab.id}
                        ref={el => { tabsRef.current[tab.id] = el; }}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group z-10
                            ${isActive
                                ? "text-white"
                                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                            }
                        `}
                    >
                        <Icon className={`w-5 h-5 transition-colors duration-300 transform group-hover:scale-110 ${isActive ? tabStyles.icon : "text-zinc-500 group-hover:text-zinc-300"}`} />

                        <div className="flex flex-col">
                            <span className="font-medium tracking-wide text-sm">{tab.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
