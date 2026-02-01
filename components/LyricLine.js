'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, X } from 'lucide-react';

export default function LyricLine({ line }) {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (!line.annotation) {
        return <div className="text-charcoal">{line.text}</div>;
    }

    return (
        <div className="relative inline-block w-full">
            {/* Clickable Line */}
            <span
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`cursor-pointer transition-all duration-300 border-b-2 ${isOpen ? 'text-slate-dark border-terracotta bg-rust/10' : 'text-charcoal border-warm-gray hover:text-slate-dark hover:border-terracotta'}`}
            >
                {line.text}
            </span>

            {/* Annotation Popup */}
            {isOpen && (
                <div ref={popupRef} className="absolute left-0 top-full mt-3 w-full md:w-[125%] z-30 animate-fade-in">
                    <div className="bg-white/95 backdrop-blur-md border border-warm-gray p-0 shadow-2xl relative">

                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-warm-gray"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-warm-gray"></div>

                        {/* Header */}
                        <div className="bg-cream-warm border-b border-warm-gray px-5 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] font-display font-bold uppercase tracking-widest text-terracotta">Annotation</div>
                                {line.timestamp && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-display text-slate-600">
                                        <Clock size={10} />
                                        {line.timestamp}
                                    </div>
                                )}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-slate-600 hover:text-terracotta transition-colors"><X size={14} /></button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-base font-body text-charcoal leading-relaxed">
                                {line.annotation}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
