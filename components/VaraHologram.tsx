import React from 'react';

interface VaraHologramProps {
    isSpeaking: boolean;
}

const VaraHologram: React.FC<VaraHologramProps> = ({ isSpeaking }) => {
    // Create an array for particles to render
    const particles = Array.from({ length: 15 }).map((_, i) => {
        const style = {
            left: `${10 + Math.random() * 80}%`,
            bottom: `${10 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
        };
        return <div key={i} className="particle" style={style}></div>;
    });

    return (
        <div className="sci-fi-panel p-4 flex flex-col items-center justify-center h-80 relative">
            <h2 className="text-lg font-orbitron text-brand-accent mb-4 absolute top-4 left-4 opacity-75 z-10">VARA AVATAR</h2>
            
            <div className="hologram-container">
                <div className="hologram-grid"></div>
                <div className="hologram-light-cone"></div>
                
                {particles}

                <svg 
                    className={`hologram-svg ${isSpeaking ? 'hologram-speaking' : ''}`}
                    viewBox="0 0 200 250" 
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMax meet"
                >
                    <g 
                        stroke="#64ffda" 
                        fill="none" 
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Main Body Structure */}
                        <g opacity="0.7">
                            {/* Head */}
                            <path d="M 100,45 A 25,30 0 0 1 100,105 A 25,30 0 0 1 100,45 Z" />
                            {/* Neck */}
                            <path d="M 95,105 L 93,115 M 105,105 L 107,115" />
                            {/* Torso */}
                            <path d="M 80,118 C 80,130 120,130 120,118 L 110,160 L 90,160 Z" />
                             {/* Arms */}
                            <path d="M 80,125 C 70,140 65,160 70,180" />
                            <path d="M 120,125 C 130,140 135,160 130,180" />
                        </g>

                        {/* Detail Layer */}
                        <g opacity="0.9">
                            {/* Hair details */}
                            <path d="M 75,75 A 30 35 0 0 1 100,45" />
                            <path d="M 125,75 A 30 35 0 0 0 100,45" />
                            <path d="M 80,100 C 90,110 110,110 120,100" />
                            {/* Facial features - abstract */}
                            <path d="M 88,80 L 112,80" className="speaking-glow" style={{transition: 'all 0.3s ease'}} />
                            <path d="M 95,95 A 5 3 0 0 1 105 95" />
                        </g>
                        
                         {/* Interactive/Speaking Layer */}
                        <g className="speaking-glow" style={{transition: 'all 0.3s ease'}}>
                           {/* Shoulder/Collar detail */}
                           <path d="M 80,120 Q 100,128 120,120" strokeWidth="1.2" />
                        </g>

                        <g className="speaking-hand" style={{transition: 'transform 0.5s ease'}}>
                           {/* Hand gesture */}
                           <path d="M 130,180 C 130,175 135,170 140,175 L 145,185 L 138,188 Z" />
                           <path d="M 140,175 L 142,165 M 143,176 L 145,166 M 145,178 L 148,168" opacity="0.6"/>
                        </g>
                    </g>
                </svg>

                <div className="data-rings">
                    <div className="data-ring"></div>
                    <div className="data-ring"></div>
                </div>

                <div className="hologram-base"></div>
            </div>
        </div>
    );
};

export default VaraHologram;