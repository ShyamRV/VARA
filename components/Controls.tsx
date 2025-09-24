import React from 'react';
import { AnomalyType } from '../types';
import { ANOMALY_TYPES, ANOMALY_DETAILS } from '../constants';
import { IconAlertTriangle, IconPause, IconPlay, IconZap } from './Icon';

interface ControlsProps {
    isLive: boolean;
    onToggleLive: () => void;
    onInjectAnomaly: (anomaly: AnomalyType) => void;
    activeAnomaly: AnomalyType | null;
    anomalyScore: number;
}

const AnomalyGauge: React.FC<{ score: number }> = ({ score }) => {
    const size = 120;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#64ffda" />
                        <stop offset="50%" stopColor="#ffcc00" />
                        <stop offset="100%" stopColor="#ff4d4d" />
                    </linearGradient>
                </defs>
                <circle className="gauge-bg" cx={center} cy={center} r={radius} strokeWidth={strokeWidth}></circle>
                <circle
                    className="gauge-arc"
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="font-orbitron text-2xl text-white">{score.toFixed(0)}</span>
                <span className="text-xs font-mono text-brand-text-light">SCORE</span>
            </div>
        </div>
    );
};


const Controls: React.FC<ControlsProps> = ({ isLive, onToggleLive, onInjectAnomaly, activeAnomaly, anomalyScore }) => {
    return (
        <div className="sci-fi-panel p-4 h-full flex flex-col">
            <h2 className="text-lg font-orbitron text-brand-accent text-glow-accent mb-4">CONTROLS</h2>

            <button
                onClick={onToggleLive}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 font-semibold sci-fi-button"
            >
                {isLive ? <IconPause /> : <IconPlay />}
                <span>{isLive ? 'PAUSE TELEMETRY' : 'RUN LIVE'}</span>
            </button>
            
            <h3 className="text-md font-bold font-orbitron text-brand-text mb-2 flex items-center gap-2">
                <IconZap className="w-5 h-5 text-brand-accent-warn" />
                INJECT ANOMALY
            </h3>
            <div className="space-y-2">
                {ANOMALY_TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => onInjectAnomaly(type)}
                        disabled={!!activeAnomaly}
                        title={ANOMALY_DETAILS[type].description}
                        className="w-full text-left px-3 py-2 text-sm font-mono sci-fi-button"
                    >
                        {'> '} {ANOMALY_DETAILS[type].name}
                    </button>
                ))}
            </div>

            <div className="mt-6 flex flex-col items-center">
                <h3 className="text-md font-bold font-orbitron text-brand-text mb-2">ML ANOMALY SCORE</h3>
                <AnomalyGauge score={anomalyScore} />
            </div>

            {activeAnomaly && (
                <div className="mt-auto pt-4 text-center text-brand-accent-warn flex items-center justify-center gap-2 border-t border-brand-accent/10">
                    <div className="relative flex items-center justify-center gap-2">
                        <IconAlertTriangle className="w-5 h-5" />
                        <span className="font-bold font-orbitron">{activeAnomaly} ANOMALY ACTIVE</span>
                        <div className="absolute w-full h-full rounded-full pulse-alert"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Controls;
