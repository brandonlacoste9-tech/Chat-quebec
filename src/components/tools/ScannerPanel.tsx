'use client';

import React, { useState, useEffect, useRef } from 'react';
import Quagga, { QuaggaJSResult } from 'quagga';
import { Camera, Search, ShieldCheck, Info, Carrot, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
    code: string;
    name: string;
    brand: string;
    image: string;
    nutriscore?: string;
    nutriments?: Record<string, any>;
    ingredients?: string;
    allergens?: string[];
    ecoscore?: string;
    categories?: string[];
}

export default function ScannerPanel() {
    const [isScanning, setIsScanning] = useState(false);
    const [history, setHistory] = useState<Product[]>([]);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const videoRef = useRef<HTMLDivElement>(null);
    const lastCodeRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (isScanning) {
                Quagga.stop();
                setIsScanning(false);
            }
        };
    }, [isScanning]);

    const startScanner = () => {
        if (!videoRef.current) return;
        setIsScanning(true);

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current,
                constraints: {
                    facingMode: "environment",
                    width: 640,
                    height: 480
                },
            },
            decoder: {
                readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader", "code_128_reader", "code_39_reader"],
            },
            locate: true,
            numOfWorkers: 2,
        }, (err: Error | null) => {
            if (err) {
                console.error(err);
                setIsScanning(false);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected((result: QuaggaJSResult) => {
            const code = result.codeResult.code;
            if (code && code !== lastCodeRef.current) {
                lastCodeRef.current = code;
                lookupBarcode(code);
            }
        });
    };

    const stopScanner = () => {
        Quagga.stop();
        setIsScanning(false);
        lastCodeRef.current = null;
    };

    const lookupBarcode = async (code: string) => {
        setIsLoading(true);
        try {
            const r = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
            const d = await r.json();
            if (d.status !== 1) {
                setIsLoading(false);
                return;
            }

            const p = d.product;
            const product: Product = {
                code,
                name: p.product_name_fr || p.product_name || 'Produit inconnu',
                brand: p.brands || 'Marque inconnue',
                image: p.image_front_url || p.image_url || '',
                nutriscore: p.nutriscore_grade?.toUpperCase(),
                nutriments: p.nutriments,
                ingredients: p.ingredients_text_fr || p.ingredients_text,
                allergens: (p.allergens_tags || []).map((a: string) => a.replace('en:', '').replace('fr:', '')),
                ecoscore: p.ecoscore_grade?.toUpperCase(),
                categories: (p.categories_tags || []).slice(0, 3).map((c: string) => c.replace('en:', '').replace('fr:', '')),
            };

            setActiveProduct(product);
            setHistory(prev => {
                const filtered = prev.filter(h => h.code !== code);
                return [product, ...filtered].slice(0, 20);
            });
            stopScanner();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const nsColors: Record<string, string> = {
        A: 'bg-[#038141]',
        B: 'bg-[#85BB2F]',
        C: 'bg-[#FECB02] !text-black',
        D: 'bg-[#EE8100]',
        E: 'bg-[#E63E11]'
    };

    return (
        <div className="absolute inset-0 flex">
            <div className="w-[320px] min-w-[320px] leather-dark border-r border-border flex flex-col overflow-hidden text-text shadow-2xl">
                <div className="p-4 border-b border-border">
                    <h1 className="font-display font-extrabold text-lg text-text tracking-tight">📦 Épicerie Québec</h1>
                    <p className="text-[11px] text-text-dim mt-1">Analyse nutritionnelle instantanée · Open Food Facts</p>
                </div>

                <div className="relative bg-black h-[220px] overflow-hidden group">
                    <div ref={videoRef} className={cn("w-full h-full", !isScanning && "opacity-20")} />

                    {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[200px] h-[120px] rounded-xl border-2 border-accent shadow-[0_0_0_9999px_rgba(0,0,0,0.5),0_0_20px_var(--qblue-glow)] relative">
                                <div className="absolute left-1 right-1 h-0.5 bg-accent shadow-[0_0_8px_var(--accent)] animate-pulse" />
                            </div>
                        </div>
                    )}

                    {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10">
                            <div className="w-14 h-14 bg-surface-2/50 backdrop-blur rounded-2xl flex items-center justify-center text-text-muted border border-border-bright">
                                <Camera size={28} />
                            </div>
                            <button
                                onClick={startScanner}
                                className="px-6 py-2.5 bg-qblue hover:bg-qblue-bright text-white font-display font-bold text-xs rounded-xl shadow-lg shadow-qblue/20 transition-all active:scale-95"
                            >
                                Activer la caméra
                            </button>
                        </div>
                    )}

                    {isScanning && (
                        <button
                            onClick={stopScanner}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-danger/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-danger/30 hover:bg-danger transition-all z-20"
                        >
                            Arrêter
                        </button>
                    )}
                </div>

                <div className="p-3 border-b border-border flex gap-2">
                    <input
                        value={manualCode}
                        onChange={e => setManualCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && manualCode && lookupBarcode(manualCode)}
                        placeholder="Entrez un code-barres..."
                        className="flex-1 px-3 py-2 bg-surface-2 border border-border-bright rounded-lg text-[12.5px] outline-none focus:border-accent"
                    />
                    <button
                        onClick={() => {
                            if (manualCode) lookupBarcode(manualCode);
                        }}
                        className="px-3 py-2 bg-surface-3 hover:bg-accent hover:text-bg rounded-lg transition-all"
                    >
                        <Search size={14} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
                    <div className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-3 px-2">Historique récent</div>
                    {history.length > 0 ? (
                        <div className="space-y-1">
                            {history.map((h, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveProduct(h)}
                                    className={cn(
                                        "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border border-transparent",
                                        activeProduct?.code === h.code ? "bg-surface-3 border-border-bright" : "hover:bg-surface-2"
                                    )}
                                >
                                    <img src={h.image} className="w-10 h-10 rounded-lg object-contain bg-white p-1" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12.5px] font-semibold text-text truncate">{h.name}</div>
                                        <div className="text-[10px] text-text-dim truncate">{h.brand}</div>
                                    </div>
                                    {h.nutriscore && (
                                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white", nsColors[h.nutriscore])}>
                                            {h.nutriscore}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-center opacity-40 px-6">
                            <Carrot size={32} className="mb-2" />
                            <p className="text-[11px]">Scannez vos produits d&apos;épicerie pour voir les détails.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-bg/50 p-6 md:p-10 scrollbar-thin">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 animate-pulse">
                        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <p className="text-sm font-display font-bold uppercase tracking-widest text-text-dim">Recherche...</p>
                    </div>
                ) : activeProduct ? (
                    <div className="max-w-[560px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="bg-surface border border-border-bright rounded-[32px] overflow-hidden shadow-2xl shadow-black/40">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center border-b border-border">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-4 flex items-center justify-center shrink-0 shadow-inner group">
                                    <img src={activeProduct.image} className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-display font-extrabold text-text leading-tight mb-2 pr-4">{activeProduct.name}</h2>
                                    <div className="text-sm text-text-dim font-medium mb-4">{activeProduct.brand} · {activeProduct.code}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeProduct.categories?.map(c => (
                                            <span key={c} className="px-2.5 py-1 rounded-full bg-surface-2 border border-border-bright text-[10px] text-text-dim font-bold uppercase tracking-wider">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-8">
                                {activeProduct.nutriscore && (
                                    <div className="bg-surface-2 border border-border-bright rounded-2xl p-4 flex items-center gap-5">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-display font-black text-white shadow-xl shadow-black/20", nsColors[activeProduct.nutriscore])}>
                                            {activeProduct.nutriscore}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-text mb-1">Nutri-Score {activeProduct.nutriscore}</div>
                                            <div className="text-[11px] text-text-dim">Qualité nutritionnelle calculée selon les normes européennes et canadiennes.</div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { l: 'Calories', v: activeProduct.nutriments?.['energy-kcal_100g'], u: 'kcal' },
                                        { l: 'Lipides', v: activeProduct.nutriments?.fat_100g, u: 'g' },
                                        { l: 'Sucres', v: activeProduct.nutriments?.sugars_100g, u: 'g' },
                                        { l: 'Protéines', v: activeProduct.nutriments?.proteins_100g, u: 'g' },
                                        { l: 'Sel', v: activeProduct.nutriments?.salt_100g, u: 'g' },
                                        { l: 'Fibres', v: activeProduct.nutriments?.fiber_100g, u: 'g' },
                                    ].map(n => (
                                        <div key={n.l} className="bg-surface border border-border rounded-xl p-4 text-center hover:border-accent/40 transition-all">
                                            <div className="text-lg font-display font-extrabold text-text leading-none">{n.v !== undefined ? `${parseFloat(n.v).toFixed(1)} ${n.u}` : '—'}</div>
                                            <div className="text-[9px] text-text-dim uppercase tracking-widest mt-2 font-bold">{n.l} / 100g</div>
                                        </div>
                                    ))}
                                </div>

                                {activeProduct.ecoscore && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                                        <div className={cn("w-2.5 h-2.5 rounded-full", nsColors[activeProduct.ecoscore] || 'bg-text-dim')} />
                                        <div className="flex-1 text-xs">
                                            <span className="font-bold text-success">Éco-Score {activeProduct.ecoscore}</span>
                                            <span className="text-text-dim ml-2">Impact environnemental maîtrisé</span>
                                        </div>
                                    </div>
                                )}

                                {activeProduct.allergens && activeProduct.allergens.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="text-[10px] text-text-dim font-bold uppercase tracking-widest flex items-center gap-2">
                                            <AlertTriangle size={12} className="text-red-400" />
                                            Allergènes détectés
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeProduct.allergens.map(a => (
                                                <span key={a} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 font-bold uppercase">
                                                    ⚠️ {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeProduct.ingredients && (
                                    <div className="space-y-3">
                                        <div className="text-[10px] text-text-dim font-bold uppercase tracking-widest">Ingrédients</div>
                                        <div className="bg-surface-2 border border-border-bright rounded-2xl p-5 text-xs text-text-dim leading-relaxed h-[150px] overflow-y-auto scrollbar-thin italic">
                                            {activeProduct.ingredients}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between px-6 opacity-30">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck size={14} />
                                Loi 25 Conforme
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Info size={14} />
                                Source: Open Food Facts
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6">
                        <div className="w-24 h-24 bg-surface rounded-[40px] flex items-center justify-center text-5xl shadow-2xl border border-border-bright animate-bounce">
                            🥫
                        </div>
                        <div className="max-w-[340px] space-y-3">
                            <h3 className="text-2xl font-display font-extrabold text-text">Prêt à analyser?</h3>
                            <p className="text-sm text-text-dim leading-relaxed">Scannez un code-barres ou entrez-le manuellement pour voir les informations nutritionnelles complètes.</p>
                        </div>
                        <div className="px-6 py-4 bg-surface-2 rounded-2xl border border-border text-[11px] text-text-dim space-y-2">
                            <p>Exemples fonctionnels :</p>
                            <p className="font-mono text-accent">3017620422003 (Nutella) · 5000112548167 (Coca-Cola)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
