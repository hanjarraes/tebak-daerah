import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import svgContent from '../assets/map/indonesia.svg?raw';
import type { GameState, GameAction } from '../types/game';

const PROVINCE_NAMES: Record<string, string> = {
  'ID-AC': 'Aceh',
  'ID-BA': 'Bali',
  'ID-BB': 'Bangka Belitung',
  'ID-BE': 'Bengkulu',
  'ID-BT': 'Banten',
  'ID-GO': 'Gorontalo',
  'ID-JA': 'Jambi',
  'ID-JB': 'Jawa Barat',
  'ID-JI': 'Jawa Timur',
  'ID-JK': 'DKI Jakarta',
  'ID-JT': 'Jawa Tengah',
  'ID-KR': 'Kepulauan Riau',
  'ID-KB': 'Kalimantan Barat',
  'ID-KI': 'Kalimantan Timur',
  'ID-KS': 'Kalimantan Selatan',
  'ID-KT': 'Kalimantan Tengah',
  'ID-KU': 'Kalimantan Utara',
  'ID-LA': 'Lampung',
  'ID-MA': 'Maluku',
  'ID-MU': 'Maluku Utara',
  'ID-NB': 'Nusa Tenggara Barat',
  'ID-NT': 'Nusa Tenggara Timur',
  'ID-PA': 'Papua',
  'ID-PB': 'Papua Barat',
  'ID-RI': 'Riau',
  'ID-SA': 'Sulawesi Utara',
  'ID-SB': 'Sumatera Barat',
  'ID-SG': 'Sulawesi Tenggara',
  'ID-SN': 'Sulawesi Selatan',
  'ID-SR': 'Sulawesi Selatan',
  'ID-SS': 'Sumatera Selatan',
  'ID-ST': 'Sulawesi Tengah',
  'ID-SU': 'Sumatera Utara',
  'ID-YO': 'DI Yogyakarta',
};

interface PathData { id: string; d: string; }

function parseSVGPaths(svgString: string): PathData[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'text/html');
  const paths: PathData[] = [];
  doc.querySelectorAll('path').forEach((path) => {
    const d = path.getAttribute('d');
    if (d) paths.push({ id: path.getAttribute('id') ?? '', d });
  });
  return paths;
}

interface VB { x: number; y: number; w: number; h: number; }

// Nilai viewBox asli dari SVG
const ORIG: VB = { x: -2, y: 285.33, w: 964, h: 389.33 };
const ZOOM_STEP = 1.5;
const MAX_ZOOM = 8;

function applyZoom(vb: VB, factor: number, cx: number, cy: number): VB {
  const newW = Math.max(ORIG.w / MAX_ZOOM, Math.min(ORIG.w, vb.w / factor));
  if (newW >= ORIG.w) return ORIG; // snap ke original saat zoom out penuh
  const scale = newW / vb.w;
  return {
    x: cx - (cx - vb.x) * scale,
    y: cy - (cy - vb.y) * scale,
    w: newW,
    h: newW * (ORIG.h / ORIG.w),
  };
}

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function IndonesiaMap({ state, dispatch }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [vb, setVb] = useState<VB>(ORIG);
  const [drag, setDrag] = useState<{ mx: number; my: number } | null>(null);
  const [hasDragged, setHasDragged] = useState(false);

  const paths = useMemo(() => parseSVGPaths(svgContent), []);
  const zoom = ORIG.w / vb.w;

  const getProvinceFill = (id: string): string => {
    if (state.phase === 'feedback') {
      const currentQ = state.questions[state.currentIndex];
      if (id === currentQ?.correctProvinceId) return '#5BAD4E';
      if (id === state.selectedProvinceId && id !== currentQ?.correctProvinceId) return '#E05A4E';
      return '#A8D5A2';
    }
    if (id === state.selectedProvinceId) return '#4A90D9';
    return '#A8D5A2';
  };

  const isInteractive = state.phase === 'playing' || state.phase === 'confirming';

  // Wheel listener native agar bisa preventDefault (React onWheel = passive)
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    setVb(prev => {
      const cx = prev.x + ((e.clientX - rect.left) / rect.width) * prev.w;
      const cy = prev.y + ((e.clientY - rect.top) / rect.height) * prev.h;
      return applyZoom(prev, factor, cx, cy);
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const zoomToCenter = (factor: number) => {
    setVb(prev => applyZoom(prev, factor, prev.x + prev.w / 2, prev.y + prev.h / 2));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setDrag({ mx: e.clientX, my: e.clientY });
    setHasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (drag) {
      const dx = e.clientX - drag.mx;
      const dy = e.clientY - drag.my;
      // Tandai sebagai drag setelah melewati threshold 4px
      if (!hasDragged && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        setHasDragged(true);
        setDrag({ mx: e.clientX, my: e.clientY });
        setTooltip(null);
        return;
      }
      if (hasDragged) {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        setVb(prev => ({
          ...prev,
          x: prev.x - dx * prev.w / rect.width,
          y: prev.y - dy * prev.h / rect.height,
        }));
        setDrag({ mx: e.clientX, my: e.clientY });
        setTooltip(null);
      }
      return;
    }
    // Tooltip saat tidak drag
    const id = (e.target as SVGElement).getAttribute('id') ?? '';
    if (id && PROVINCE_NAMES[id]) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTooltip({ name: PROVINCE_NAMES[id], x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    // Hanya dispatch klik jika tidak ada drag (pure click)
    if (!hasDragged && state.phase === 'playing') {
      const id = (e.target as SVGElement).getAttribute('id') ?? '';
      if (id && PROVINCE_NAMES[id]) {
        dispatch({ type: 'SELECT_PROVINCE', provinceId: id });
      }
    }
    setDrag(null);
    setHasDragged(false);
  };

  const handleMouseLeave = () => {
    setDrag(null);
    setHasDragged(false);
    setTooltip(null);
  };

  const svgCursor = drag && hasDragged
    ? 'grabbing'
    : drag
      ? 'grab'
      : (tooltip && isInteractive ? 'pointer' : 'grab');

  const canZoomOut = zoom > 1.05;

  return (
    <div ref={containerRef} className="relative w-full select-none">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          className="w-8 h-8 bg-at-cream border-2 border-at-black shadow-[2px_2px_0_#1A1A1A] rounded font-bubblegum text-at-black text-lg leading-none hover:-translate-y-0.5 transition-transform"
          onClick={() => zoomToCenter(ZOOM_STEP)}
          title="Zoom in"
        >+</button>
        <button
          className="w-8 h-8 bg-at-cream border-2 border-at-black shadow-[2px_2px_0_#1A1A1A] rounded font-bubblegum text-at-black text-lg leading-none transition-transform disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5"
          onClick={() => zoomToCenter(1 / ZOOM_STEP)}
          disabled={!canZoomOut}
          title="Zoom out"
        >−</button>
        <button
          className="w-8 h-8 bg-at-cream border-2 border-at-black shadow-[2px_2px_0_#1A1A1A] rounded text-at-black text-base leading-none transition-transform disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5"
          onClick={() => setVb(ORIG)}
          disabled={!canZoomOut}
          title="Reset tampilan"
        >↺</button>
      </div>

      {/* Zoom level badge */}
      {canZoomOut && (
        <div className="absolute bottom-2 right-2 z-10 bg-at-black text-white font-bubblegum text-xs px-2 py-0.5 rounded-full opacity-60">
          {zoom.toFixed(1)}×
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className="w-full"
        style={{ display: 'block', cursor: svgCursor }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {paths.map(({ id, d }, i) => (
          <path
            key={id || i}
            id={id}
            d={d}
            fill={PROVINCE_NAMES[id] ? getProvinceFill(id) : '#dadada'}
            stroke="#1A1A1A"
            strokeWidth={1.5 / zoom}
            style={{ transition: 'fill 0.2s ease' }}
          />
        ))}
      </svg>

      {tooltip && !drag && (
        <div
          className="absolute pointer-events-none bg-at-cream border-2 border-at-black px-2 py-1 rounded font-patrick text-sm shadow-[2px_2px_0_#1A1A1A] z-50"
          style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
