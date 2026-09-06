import { cloneElement, isValidElement, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { arrow, autoUpdate, flip, FloatingArrow, offset, safePolygon, shift, useDismiss, useFocus, useFloating, useHover, useInteractions, useRole, type Placement } from "@floating-ui/react";
import { HelpIcon } from "../icons";

export type TooltipVariant = "rich" | "compact" | "sidebar";

export interface TooltipProps {
    text: ReactNode;
    children?: ReactNode;
    variant?: TooltipVariant;
    side?: Placement;
    distance?: number;
    disabled?: boolean;
    asChild?: boolean;
    portal?: boolean;
}

const DEFAULT_SIDE: Record<TooltipVariant, Placement> = { rich: "top", compact: "top", sidebar: "right" };

export function Tooltip({ text, children, variant = "compact", side, distance, disabled = false, asChild = false, portal }: TooltipProps) {
    const isRich = variant === "rich";
    const isSidebar = variant === "sidebar";
    const [open, setOpen] = useState(false);
    const arrowRef = useRef(null);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        middleware: isRich
            ? [offset(distance ?? 10), flip(), shift({ padding: 12 }), arrow({ element: arrowRef })]
            : isSidebar
                ? [offset(distance ?? 25), flip(), shift(), arrow({ element: arrowRef })]
                : [offset(distance ?? 8), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
        placement: side ?? DEFAULT_SIDE[variant],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { move: false, enabled: isRich || isSidebar, handleClose: isRich ? safePolygon({ buffer: 2 }) : null });
    const focus = useFocus(context, { enabled: isRich });
    const dismiss = useDismiss(context, { enabled: isRich });
    const role = useRole(context, { role: "tooltip", enabled: isRich });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    const show = open && !disabled;

    if (isSidebar) {
        const child = children as ReactElement<Record<string, unknown>>;
        const trigger = asChild && isValidElement(child)
            ? cloneElement(child, { ref: refs.setReference, ...getReferenceProps(child.props) })
            : <span className="relative" ref={refs.setReference} {...getReferenceProps()}>{children}</span>;

        const surface = (
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="bg-black/75 rounded-md p-2 min-w-max z-50">
                <FloatingArrow ref={arrowRef} context={context} className="fill-black/75" />
                <span className="text-white z-50">{text}</span>
            </div>
        );

        return (
            <>
                {trigger}
                {show && (portal ? createPortal(surface, document.body) : surface)}
            </>
        );
    }

    if (isRich) {
        return (
            <>
                <span className="relative inline-flex items-center justify-center transition-all duration-200" ref={refs.setReference} {...getReferenceProps({ tabIndex: 0 })}>
                    {children ?? <HelpIcon className="w-4 h-4 text-zinc-500 hover:text-purple-400 hover:scale-110 transition-all duration-200 cursor-help drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />}
                </span>
                {show && createPortal(
                    <div ref={refs.setFloating} style={{ ...floatingStyles, animation: "fadeIn 150ms ease-out" }} className="z-[9999] rounded-xl border border-white/10 bg-zinc-900/90 px-3.5 py-2.5 text-[12px] text-zinc-100 shadow-[0_14px_35px_rgba(0,0,0,0.45)] w-[min(92vw,420px)]" {...getFloatingProps()}>
                        <div className="max-h-64 overflow-y-auto pr-1">
                            <p className="leading-[1.35rem] whitespace-pre-line break-words">{text}</p>
                        </div>
                        <FloatingArrow ref={arrowRef} context={context} className="fill-zinc-900/90" />
                    </div>,
                    document.body
                )}
            </>
        );
    }

    const surface = (
        <div ref={refs.setFloating} style={floatingStyles} className="z-50 bg-black/75 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
            {text}
            <FloatingArrow ref={arrowRef} context={context} className="fill-black/75" />
        </div>
    );

    return (
        <>
            <span className="relative" ref={refs.setReference} tabIndex={0} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                {children}
            </span>
            {show && (portal ? createPortal(surface, document.body) : surface)}
        </>
    );
}
