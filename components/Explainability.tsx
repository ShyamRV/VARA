import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TelemetryDataPoint, DiagnosisResult } from '../types';
import { useVaraTTS } from '../hooks/useVaraTTS';

interface ExplainabilityProps {
    telemetryData: TelemetryDataPoint[];
    activeDiagnosis: DiagnosisResult[] | null;
}

const Explainability: React.FC<ExplainabilityProps> = ({ telemetryData, activeDiagnosis }) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const { speak } = useVaraTTS();

    const handleExplainClick = () => {
        if (!activeDiagnosis) return;
        const topFault = activeDiagnosis[0];
        const explanation = `Based on the digital twin's causal model: ${topFault.explanation}`;
        setShowExplanation(true);
        speak(explanation);
    };
    
    const recentData = telemetryData.slice(-60);
    const isCo2Anomaly = activeDiagnosis?.[0]?.fault.includes("Scrubber");

    return (
        <div className="sci-fi-panel p-4">
            <h2 className="text-lg font-orbitron text-brand-accent mb-2">EXPLAINABILITY</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="md:w-1/3">
                    <h3 className="font-bold font-orbitron text-brand-text">QUERY AVATAR</h3>
                    <button 
                        onClick={handleExplainClick}
                        disabled={!isCo2Anomaly}
                        className="w-full mt-2 text-left px-3 py-2 text-sm font-mono sci-fi-button"
                    >
                        {'> '} Why the Scrubber fault?
                    </button>
                    {showExplanation && activeDiagnosis && (
                        <div className="mt-4 p-3 border border-brand-accent/30 bg-black/20" style={{clipPath: 'polygon(0 8px, 8px 0, 100% 0, 100% 100%, 0 100%)'}}>
                            <p className="text-sm font-bold font-orbitron text-brand-accent">VARA EXPLAINS:</p>
                            <p className="text-sm text-brand-text-light mt-1 font-mono">
                               {activeDiagnosis[0].explanation}
                            </p>
                        </div>
                    )}
                </div>
                <div className="md:w-2/3 h-48 w-full">
                    {showExplanation && isCo2Anomaly ? (
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recentData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                 <CartesianGrid strokeDasharray="1 4" stroke="rgba(100, 255, 218, 0.1)" />
                                 <XAxis dataKey="timestamp" tick={false} label={{ value: 'Time (last 60s)', position: 'insideBottom', offset: 0, fill: '#8892b0', fontSize: 10, fontFamily: 'Roboto Mono'}}/>
                                 <YAxis yAxisId="left" stroke="#bb9af7" tick={{fontSize: 10}} fontFamily="Roboto Mono" />
                                 <YAxis yAxisId="right" orientation="right" stroke="#64ffda" tick={{fontSize: 10}} domain={[0, 1.2]} ticks={[0, 1]} fontFamily="Roboto Mono"/>
                                 <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.8)', borderColor: 'rgba(100, 255, 218, 0.3)', fontFamily: 'Roboto Mono' }} formatter={(value, name) => [value, name]}/>
                                 <Legend wrapperStyle={{fontSize: "10px", fontFamily: "Orbitron"}} verticalAlign="top" height={25} />
                                <Line yAxisId="left" type="monotone" dataKey="airflow_m_s" name="Airflow (m/s)" stroke="#bb9af7" dot={false} strokeWidth={2}/>
                                <Line yAxisId="right" type="step" dataKey="valve_command_status" name="Valve Command (1=Open)" stroke="#64ffda" dot={false} strokeWidth={2}/>
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-brand-accent/10">
                            <p className="text-brand-text-light font-mono text-center">// Awaiting query for correlation plot //</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explainability;
