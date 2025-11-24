import { useEffect } from "react";

export default function Splash({ onFinish }) {
    useEffect(() => {
        const timer = setTimeout(() => onFinish(), 6000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-teal-500/10 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"></div>
                <div className="absolute w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full top-1/3 left-1/3 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">

                {/* Animated Coin */}
                <div className="mb-10 perspective-1000">
                    <div className="w-32 h-32 relative animate-float transform-style-3d">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_50px_rgba(245,158,11,0.4)] flex items-center justify-center border-4 border-amber-200/30 animate-flip transform-style-3d">
                            <span className="text-5xl filter drop-shadow-lg">₹</span>
                            {/* Shine effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-50"></div>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-400 to-emerald-400 drop-shadow-sm">
                        RareRupees
                    </span>
                </h1>

                {/* Tagline */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide">
                        A curated archive of India's rarest coins
                    </p>
                    <p className="text-slate-400 text-sm uppercase tracking-widest opacity-80">
                        Collected with passion by <span className="text-teal-400 font-medium">Sanket</span>
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-12 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 animate-progress shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                </div>

            </div>
        </div>
    );
}
