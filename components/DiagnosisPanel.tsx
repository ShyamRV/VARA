import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar } from 'recharts';
import { AnomalyType, TelemetryDataPoint, DiagnosisResult } from '../types';
import { PARAMETERS } from '../constants';
import { IconAlertTriangle } from './Icon';

interface DiagnosisPanelProps {
    latestDataPoint: TelemetryDataPoint | null;
    diagnosisResult: DiagnosisResult[] | null;
    onResolveAnomaly: () => void;
}

const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ latestDataPoint, diagnosisResult, onResolveAnomaly }) => {
    
    const renderLatestData = () => (
        <ul className="text-sm space-y-2 font-mono">
            {Object.values(PARAMETERS).map(p => {
                const value = latestDataPoint ? latestDataPoint[p.key] : 0;
                const topFault = diagnosisResult?.[0];
                const isAnomalous = topFault && p.name.toLowerCase().includes(topFault.fault.split(' ')[0].toLowerCase());
                
                const valueColor = 
                    isAnomalous ? 'text-brand-accent-danger' : 
                    p.key === 'co2_ppm' && typeof value === 'number' && value > 600 ? 'text-brand-accent-warn' : 
                    'text-brand-text';

                return (
                    <li key={p.key} className="flex justify-between items-baseline border-b border-brand-accent/10 pb-1">
                        <span className="text-brand-text-light">{p.name}:</span>
                        <span className={`font-bold ${valueColor}`}>
                            {typeof value === 'number' ? value.toFixed(2) : value} 
                            <span className="text-xs text-brand-text-light ml-1">{p.unit}</span>
                        </span>
                    </li>
                );
            })}
        </ul>
    );

    const renderAnomalySection = () => {
        if (!diagnosisResult) {
            return <p className="text-sm text-brand-text-light text-center py-8 font-mono">// System Nominal - Awaiting ML Anomaly Flag //</p>;
        }
        
        const topFault = diagnosisResult[0];
        
        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-md font-orbitron text-brand-accent-warn flex items-center gap-2"><IconAlertTriangle className="w-5 h-5" /> INFERRED DIAGNOSIS (PGM)</h3>
                    <div className="mt-2 space-y-2">
                        {diagnosisResult.map((result) => (
                             <div key={result.fault} className="text-sm font-mono">
                                <div className="flex justify-between items-center">
                                    <span>{result.fault}</span>
                                    <span className="font-bold text-brand-accent-warn">{(result.probability * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-black/20 mt-1">
                                    <div className="h-1 bg-brand-accent-warn" style={{width: `${result.probability*100}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="text-md font-orbitron text-brand-accent">VARA RECOMMENDS</h3>
                    <p className="text-sm text-brand-text mt-1 font-mono">{topFault.explanation}</p>
                    <p className="text-sm text-brand-text mt-2 font-mono bg-black/20 p-2 border-l-2 border-brand-accent">
                        ACTION: <span className="font-bold">{topFault.recommendedAction}</span>
                    </p>
                    <button onClick={onResolveAnomaly} className="w-full mt-3 px-4 py-2 font-semibold sci-fi-button">
                        {topFault.recommendedAction.toUpperCase()} (EXECUTE)
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="sci-fi-panel p-4 flex-grow flex flex-col space-y-4">
            <div>
                <h2 className="text-lg font-orbitron text-brand-accent mb-2">DIAGNOSIS & RECOVERY</h2>
                {renderLatestData()}
            </div>
            <div className="flex-grow border-t border-brand-accent/20 pt-4">
                {renderAnomalySection()}
            </div>
        </div>
    );
};

export default DiagnosisPanel;
