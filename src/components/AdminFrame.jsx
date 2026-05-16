import { memo, useCallback, useRef } from "react";
import { useCMS } from "../hooks/useCMS";

const readPoint = (event) => ({ x: event.clientX, y: event.clientY });

const AdminFrame = ({ frameKey, label, children, className = "", style = {}, resize = true }) => {
  const { adminMode, ev, updateFrame } = useCMS();
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const startDrag = useCallback((event) => {
    if (!adminMode || event.target.dataset.resizeHandle) return;
    event.preventDefault();
    const start = readPoint(event);
    dragRef.current = {
      start,
      originX: ev(`${frameKey}PosX`) || 0,
      originY: ev(`${frameKey}PosY`) || 0,
    };

    const onMove = (moveEvent) => {
      if (!dragRef.current) return;
      const point = readPoint(moveEvent);
      updateFrame(frameKey, {
        PosX: Math.round(dragRef.current.originX + point.x - dragRef.current.start.x),
        PosY: Math.round(dragRef.current.originY + point.y - dragRef.current.start.y),
      });
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [adminMode, ev, frameKey, updateFrame]);

  const startResize = useCallback((event) => {
    if (!adminMode || !resize) return;
    event.preventDefault();
    event.stopPropagation();
    const start = readPoint(event);
    resizeRef.current = {
      start,
      width: ev(`${frameKey}Width`) || event.currentTarget.parentElement.offsetWidth,
      height: ev(`${frameKey}Height`) || event.currentTarget.parentElement.offsetHeight,
    };

    const onMove = (moveEvent) => {
      if (!resizeRef.current) return;
      const point = readPoint(moveEvent);
      updateFrame(frameKey, {
        Width: Math.max(0, Math.round(resizeRef.current.width + point.x - resizeRef.current.start.x)),
        Height: Math.max(0, Math.round(resizeRef.current.height + point.y - resizeRef.current.start.y)),
      });
    };

    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [adminMode, ev, frameKey, resize, updateFrame]);

  const frameStyle = {
    ...style,
    transform: `${style.transform || ""} translate(${ev(`${frameKey}PosX`) || 0}px, ${ev(`${frameKey}PosY`) || 0}px)`,
    width: ev(`${frameKey}Width`) ? `${ev(`${frameKey}Width`)}px` : style.width,
    height: ev(`${frameKey}Height`) ? `${ev(`${frameKey}Height`)}px` : style.height,
  };

  const positioned = /\b(absolute|fixed|relative|sticky)\b/.test(className);

  return (
    <div
      className={`${className} ${adminMode ? `admin-frame ${positioned ? "" : "relative"}` : ""}`}
      style={frameStyle}
      onPointerDown={startDrag}
      data-admin-frame={frameKey}
    >
      {adminMode && (
        <div className="pointer-events-none absolute -top-7 left-0 z-[80] rounded-full border border-cyan-300/40 bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200 shadow-[0_0_22px_rgba(0,217,255,.25)]">
          {label}
        </div>
      )}
      {children}
      {adminMode && resize && (
        <button
          type="button"
          data-resize-handle="true"
          onPointerDown={startResize}
          className="absolute -bottom-3 -right-3 z-[90] h-7 w-7 rounded-lg border border-cyan-300/50 bg-black/90 text-cyan-200 shadow-[0_0_22px_rgba(0,217,255,.35)]"
          aria-label={`Resize ${label}`}
        >
          ◢
        </button>
      )}
    </div>
  );
};

export default memo(AdminFrame);
