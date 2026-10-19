import { lazy, Suspense, useState } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

const ThreeScene = lazy(async () => {
  const mod = await import("./ThreeScene");
  return { default: mod.ThreeScene };
});

export interface ModelRoom {
  id: string;
  name: string;
  objectNames: string[];
  hotspot: [number, number, number];
}

export interface ModelViewerProps {
  glb: string;
  rooms: ModelRoom[];
  defaultRoom?: string;
  watermark?: string;
  className?: string;
  enabled?: boolean;
}

type Quality = "low" | "med" | "high";

export function ModelViewer({
  glb,
  rooms,
  defaultRoom,
  watermark = "HomeKey 3D",
  className,
  enabled = true,
}: ModelViewerProps) {
  const [quality, setQuality] = useState<Quality>("med");
  const [hidden, setSelected] = useState<Set<string>>(new Set());
  const [activeRoom, setActiveRoom] = useState<string | null>(defaultRoom ?? rooms[0]?.id ?? null);
  const [autorotate, setAutorotate] = useState(true);
  const [showPanel, setShowPanel] = useState(true);

  const active = rooms.find((r) => r.id === activeRoom) ?? rooms[0];

  const toggleRoom = (room: ModelRoom) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const isHidden = room.objectNames.some((n) => next.has(n));
      if (isHidden) room.objectNames.forEach((n) => next.delete(n));
      else room.objectNames.forEach((n) => next.add(n));
      return next;
    });
  };
  const isRoomHidden = (room: ModelRoom) => room.objectNames.some((n) => hidden.has(n));
  const resetView = () => {
    setSelected(new Set());
    setAutorotate(true);
  };
  const flyToRoom = (room: ModelRoom) => {
    setActiveRoom(room.id);
  };

  if (!enabled) return null;

  return (
    <div className={clsx("canvas-stage relative", className)}>
      <Suspense
        fallback={
          <div className="absolute inset-0 grid place-items-center bg-cream-100/70">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-brass-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-brass-500" />
            </div>
          </div>
        }
      >
        <ThreeScene
          glb={glb}
          quality={quality}
          hiddenNames={hidden}
          autorotate={autorotate}
          activeRoom={active}
        />
      </Suspense>

      <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
        <div className="glass-strong flex items-center gap-1 rounded-full p-1">
          {(["low", "med", "high"] as Quality[]).map((q) => (
            <button
              key={q}
              type="button"
              aria-pressed={quality === q}
              onClick={() => setQuality(q)}
              className={clsx(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors",
                quality === q
                  ? "bg-brass-500 text-white"
                  : "text-ink-700 hover:bg-brass-100 dark:text-muted-300",
              )}
            >
              {q}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={resetView}
          title="Reset view"
          className="glass-strong grid h-9 w-9 place-items-center rounded-full text-ink-700 hover:text-brass-600 dark:text-muted-300"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setShowPanel((current) => !current)}
          title={showPanel ? "Hide room list" : "Show room list"}
          className="glass-strong grid h-9 w-9 place-items-center rounded-full text-ink-700 hover:text-brass-600 dark:text-muted-300"
          aria-label={showPanel ? "Hide room list" : "Show room list"}
        >
          {showPanel ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      {showPanel ? (
        <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2">
          <div className="glass-strong flex flex-col gap-1.5 rounded-2xl p-1.5">
            {rooms.map((room) => {
              const hiddenRoom = isRoomHidden(room);
              return (
                <button
                  key={room.id}
                  type="button"
                  title={room.name}
                  aria-label={`${room.name}${hiddenRoom ? " (hidden)" : ""}`}
                  aria-pressed={activeRoom === room.id}
                  onClick={() => flyToRoom(room)}
                  className={clsx(
                    "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors",
                    activeRoom === room.id
                      ? "bg-brass-100 text-brass-900 dark:bg-brass-700/30 dark:text-brass-100"
                      : "text-ink-700 hover:bg-brass-50 dark:text-muted-300 dark:hover:bg-white/10",
                  )}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brass-100 text-brass-700 dark:bg-brass-700/40 dark:text-brass-200">
                    {room.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{room.name}</span>
                    <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-500 dark:text-muted-400">
                      {hiddenRoom ? "Hidden" : "Visible"}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={hiddenRoom ? `Show ${room.name}` : `Hide ${room.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoom(room);
                    }}
                    className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brass-50 text-brass-700 hover:bg-brass-200 dark:bg-white/10 dark:text-muted-300"
                  >
                    {hiddenRoom ? (
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 z-20">
        <span className="glass-strong inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-ink-700 dark:text-muted-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brass-500 animate-pulse-ring" aria-hidden="true" />
          Drag to orbit · Scroll to zoom · Tap a room to fly in
        </span>
      </div>

      {watermark ? (
        <span className="absolute bottom-3 right-3 z-20 text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-600/80 dark:text-brass-300/70">
          {watermark}
        </span>
      ) : null}
    </div>
  );
}

export default ModelViewer;