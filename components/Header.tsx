import React from 'react';
import { IconSatellite } from './Icon';

const Header: React.FC = () => {
    return (
        <header className="relative py-3 px-6 bg-brand-surface/30 border-t border-b border-brand-accent/20">
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-1/3 h-full border-r border-brand-accent/10 skew-x-[-30deg] ml-[-3rem]"></div>
            
            <div className="relative flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <IconSatellite className="w-8 h-8 text-brand-accent text-glow-accent" />
                    <div>
                        <h1 className="text-2xl font-orbitron text-brand-accent text-glow-accent">
                            VARA :: ECLSS MONITOR
                        </h1>
                        <p className="text-brand-text-light text-sm font-mono tracking-widest">
                            AUTONOMOUS FAULT MANAGEMENT SYSTEM
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 h-full w-16 bg-brand-surface/30 clip-path-polygon-[100%_0,0_0,100%_100%]"></div>
            <div className="absolute top-0 right-0 h-1/2 w-8 border-t-2 border-l-2 border-brand-accent clip-path-polygon-[100%_0,0_0,0_100%] opacity-50"></div>
        </header>
    );
};

// Custom clip-path utility for Tailwind
const style = document.createElement('style');
style.innerHTML = `
  .clip-path-polygon-\\[100\\%_0\\,0_0\\,100\\%_100\\%\\] {
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
  .clip-path-polygon-\\[100\\%_0\\,0_0\\,0_100\\%\\] {
    clip-path: polygon(100% 0, 0 0, 0 100%);
  }
`;
document.head.appendChild(style);


export default Header;
