'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation, Smile, X, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

// fix for leaflet icons
const fixLeafletIcons = () => {
    // @ts-expect-error - Leaflet icon internals
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

const EMOJIS = [
    { label: 'Lieux', e: ['🏠', '🏢', '🏪', '🏫', '🏥', '🏦', '🏨', '⛪', '🏛️', '🗼', '🏟️', '🏰', '🗽', '🗿', '⛩️', '🏯', '🏬', '🏭', '🏚️', '🏗️'] },
    { label: 'Nature', e: ['🌲', '🌳', '🌴', '🌵', '🍁', '🍂', '❄️', '🌊', '⛰️', '🏔️', '🗻', '🌋', '🏕️', '🌾', '🌿', '🍄', '🌸', '🌺', '🌻', '🌼'] },
    { label: 'Transport', e: ['🚗', '🚕', '🚙', '🚌', '🚎', '🚑', '🚒', '🚓', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '✈️', '🚂', '⛵', '🛶', '🛺', '🚡'] },
    { label: 'Bouffe', e: ['🍕', '🍔', '🌮', '🌯', '🍣', '🍜', '🍝', '🥗', '🍱', '🥪', '☕', '🍺', '🍷', '🧋', '🍦', '🥐', '🧇', '🥧', '🫕', '🍁'] },
    { label: 'Alertes', e: ['⚠️', '🚧', '❌', '🚫', '⛔', '🔴', '🟡', '🟢', '💡', '🔔', '📢', '🚨', '⚡', '💥', '🌡️', '🧊', '☁️', '🌧️', '❄️', '🌪️'] },
    { label: 'Québec', e: ['⚜️', '🍁', '🐦', '🦌', '🦫', '🦉', '🐻', '🦅', '🏒', '🎿', '⛸️', '🌨️', '🥌', '🎻', '🪗', '🍺', '🫐', '🍄', '🌲', '🏔️'] },
];

export default function MapPanel() {
    const mapRef = useRef<L.Map | null>(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [isRouting, setIsRouting] = useState(false);
    const [stats, setStats] = useState<{ dist: string; time: string } | null>(null);
    const [steps, setSteps] = useState<any[]>([]);
    const [pinMode, setPinMode] = useState<{ active: boolean; emoji: string | null }>({ active: false, emoji: null });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeEmojiCat, setActiveEmojiCat] = useState(0);

    const routeLineRef = useRef<L.Polyline | null>(null);
    const emojiMarkersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        fixLeafletIcons();
        if (!mapRef.current) {
            mapRef.current = L.map('map-container', {
                center: [46.8139, -71.2080],
                zoom: 7,
                zoomControl: false
            });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors © CARTO',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Re-bind click listener when pinMode changes
    useEffect(() => {
        if (!mapRef.current) return;
        mapRef.current.off('click');
        mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            if (pinMode.active && pinMode.emoji) {
                dropEmoji(lat, lng, pinMode.emoji);
                setPinMode({ active: false, emoji: null });
                return;
            }
        });
    }, [pinMode]);

    const dropEmoji = (lat: number, lng: number, emoji: string) => {
        if (!mapRef.current) return;
        const icon = L.divIcon({
            html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6));cursor:pointer">${emoji}</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 22],
            className: ''
        });
        const m = L.marker([lat, lng], { icon }).addTo(mapRef.current);
        m.on('contextmenu', () => {
            if (mapRef.current) mapRef.current.removeLayer(m);
            emojiMarkersRef.current = emojiMarkersRef.current.filter(x => x !== m);
        });
        emojiMarkersRef.current.push(m);
    };

    const geocode = async (q: string) => {
        const query = q.toLowerCase().includes('québec') || q.toLowerCase().includes('quebec') || q.match(/\d/) ? q : `${q}, Québec, Canada`;
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=fr`);
        const d = await r.json();
        if (!d.length) throw new Error(`Lieu introuvable: "${q}"`);
        return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
    };

    const calcRoute = async () => {
        if (!from || !to) return;
        setIsRouting(true);
        try {
            const fCoords = await geocode(from);
            const tCoords = await geocode(to);

            const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${fCoords[1]},${fCoords[0]};${tCoords[1]},${tCoords[0]}?overview=full&geometries=geojson&steps=true`);
            const d = await r.json();
            if (d.code !== 'Ok') throw new Error('Itinéraire introuvable');

            const route = d.routes[0];
            if (routeLineRef.current && mapRef.current) mapRef.current.removeLayer(routeLineRef.current);

            const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
            if (mapRef.current) {
                routeLineRef.current = L.polyline(coords, { color: '#3b82f6', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }).addTo(mapRef.current);
                mapRef.current.fitBounds(L.latLngBounds([fCoords as [number, number], tCoords as [number, number]]), { padding: [50, 50] });
            }

            setStats({
                dist: (route.distance / 1000).toFixed(1) + ' km',
                time: Math.round(route.duration / 60) >= 60
                    ? `${Math.floor(Math.round(route.duration / 60) / 60)}h${String(Math.round(route.duration / 60) % 60).padStart(2, '0')}`
                    : `${Math.round(route.duration / 60)} min`
            });
            setSteps(route.legs[0].steps);
        } catch (e) {
            console.error(e);
        } finally {
            setIsRouting(false);
        }
    };

    return (
        <div className="absolute inset-0 flex">
            {/* Sidebar */}
            <div className="w-[300px] min-w-[300px] bg-surface border-r border-border flex flex-col z-10">
                <div className="p-3 border-b border-border space-y-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        <input
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            placeholder="Point de départ..."
                            className="w-full pl-8 pr-3 py-2.5 bg-surface-2 border border-border-bright rounded-lg text-[12.5px] outline-none focus:border-accent transition-all"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-danger shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                        <input
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            placeholder="Destination..."
                            className="w-full pl-8 pr-3 py-2.5 bg-surface-2 border border-border-bright rounded-lg text-[12.5px] outline-none focus:border-accent transition-all"
                        />
                    </div>
                    <button
                        onClick={calcRoute}
                        disabled={isRouting}
                        className="w-full py-2.5 bg-qblue hover:bg-qblue-bright text-white font-display font-bold text-xs rounded-lg shadow-lg shadow-qblue/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isRouting ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Navigation size={14} />}
                        ↗ Calculer l&apos;itinéraire
                    </button>
                </div>

                {stats && (
                    <div className="flex p-3 border-b border-border bg-surface-2/30 animate-in fade-in duration-300">
                        <div className="flex-1 text-center">
                            <div className="text-lg font-display font-extrabold text-accent">{stats.dist}</div>
                            <div className="text-[10px] text-text-dim uppercase tracking-wider">Distance</div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-lg font-display font-extrabold text-accent">{stats.time}</div>
                            <div className="text-[10px] text-text-dim uppercase tracking-wider">Durée</div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-1.5 scrollbar-thin">
                    {steps.length > 0 ? (
                        <div className="space-y-0.5">
                            {steps.map((s, i) => (
                                <div
                                    key={i}
                                    className="p-2 rounded-lg hover:bg-surface-2 cursor-pointer transition-all flex items-start gap-3 group"
                                >
                                    <div className="w-5 h-5 bg-qblue text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className="text-[12.5px] text-text leading-snug group-hover:text-qblue-bright transition-colors">
                                            {s.maneuver.instruction || s.name || 'Continuer'}
                                        </div>
                                        <div className="text-[10px] text-text-muted mt-1">
                                            {s.distance >= 1000 ? `${(s.distance / 1000).toFixed(1)} km` : `${Math.round(s.distance)} m`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-40">
                            <Compass size={32} className="text-text-dim mb-2" />
                            <p className="text-xs text-text-dim">Cherche un itinéraire ou clique sur la carte pour commencer.</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-border bg-surface-2/20">
                    <div className="text-[9px] text-text-dim font-bold uppercase tracking-widest mb-2 px-1">Lieux populaires</div>
                    <div className="grid grid-cols-2 gap-1.5">
                        {[
                            { n: 'Vieux-MTL', l: [45.5017, -73.5673] },
                            { n: 'Vieux-QC', l: [46.8139, -71.2080] },
                            { n: 'Mont-Royal', l: [45.5231, -73.5834] },
                            { n: 'Saguenay', l: [48.4186, -71.0532] },
                        ].map(p => (
                            <button
                                key={p.n}
                                onClick={() => {
                                    if (mapRef.current) mapRef.current.setView(p.l as [number, number], 14, { animate: true });
                                }}
                                className="px-2.5 py-2 rounded-lg bg-surface-2 border border-border text-[11px] text-text-dim hover:text-accent hover:border-accent transition-all text-left truncate"
                            >
                                📍 {p.n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Content */}
            <div className="flex-1 relative overflow-hidden bg-bg">
                <div id="map-container" className="w-full h-full" />

                {/* Map Controls */}
                <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
                    <button onClick={() => mapRef.current?.zoomIn()} className="w-9 h-9 bg-surface/90 backdrop-blur border border-border-bright rounded-xl flex items-center justify-center text-text hover:bg-surface transition-all shadow-xl">+</button>
                    <button onClick={() => mapRef.current?.zoomOut()} className="w-9 h-9 bg-surface/90 backdrop-blur border border-border-bright rounded-xl flex items-center justify-center text-text hover:bg-surface transition-all shadow-xl">−</button>
                    <button onClick={() => {
                        navigator.geolocation.getCurrentPosition(p => {
                            mapRef.current?.setView([p.coords.latitude, p.coords.longitude], 14, { animate: true });
                        });
                    }} className="w-9 h-9 bg-surface/90 backdrop-blur border border-border-bright rounded-xl flex items-center justify-center text-text hover:bg-surface transition-all shadow-xl">📍</button>
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={cn(
                            "w-9 h-9 backdrop-blur border rounded-xl flex items-center justify-center transition-all shadow-xl",
                            showEmojiPicker ? "bg-qblue border-qblue-bright text-white" : "bg-surface/90 border-border-bright text-text hover:bg-surface"
                        )}
                    >
                        <Smile size={18} />
                    </button>
                    <button onClick={() => {
                        if (mapRef.current) {
                            [routeLineRef.current].forEach(l => l && mapRef.current?.removeLayer(l));
                            emojiMarkersRef.current.forEach(m => mapRef.current?.removeLayer(m));
                            emojiMarkersRef.current = [];
                            setStats(null);
                            setSteps([]);
                        }
                    }} className="w-9 h-9 bg-surface/90 backdrop-blur border border-border-bright rounded-xl flex items-center justify-center text-text hover:bg-danger/20 hover:text-danger hover:border-danger/30 transition-all shadow-xl"><X size={18} /></button>
                </div>

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                    <div className="absolute right-14 top-3 z-[500] bg-surface w-[240px] rounded-2xl border border-border-bright shadow-2xl p-4 animate-in zoom-in-95 duration-200">
                        <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-3 pr-2 flex justify-between">
                            Marqueurs
                            <X size={12} className="cursor-pointer hover:text-danger" onClick={() => setShowEmojiPicker(false)} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {EMOJIS.map((c, i) => (
                                <button
                                    key={c.label}
                                    onClick={() => setActiveEmojiCat(i)}
                                    className={cn(
                                        "px-2 py-1 rounded-md text-[10px] transition-all",
                                        activeEmojiCat === i ? "bg-accent text-bg font-bold" : "bg-surface-2 text-text-dim hover:text-text"
                                    )}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            {EMOJIS[activeEmojiCat].e.map(e => (
                                <button
                                    key={e}
                                    onClick={() => {
                                        setPinMode({ active: true, emoji: e });
                                        setShowEmojiPicker(false);
                                    }}
                                    className="text-xl hover:scale-125 transition-transform"
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pin Badge */}
                {pinMode.active && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-qblue border border-qblue-bright text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                        <span className="text-xl">{pinMode.emoji}</span>
                        <span className="text-xs font-bold font-display uppercase tracking-wider">Cliquez sur la carte</span>
                        <X size={14} className="cursor-pointer hover:text-white" onClick={() => setPinMode({ active: false, emoji: null })} />
                    </div>
                )}

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] bg-surface/80 backdrop-blur border border-border-bright px-3 py-1.5 rounded-full text-[10px] text-text-dim flex items-center gap-2 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    OpenStreetMap · OSRM · 100% Souverain
                </div>
            </div>
        </div>
    );
}
