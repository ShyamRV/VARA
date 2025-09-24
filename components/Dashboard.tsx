import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart, Area } from 'recharts';
import { TelemetryDataPoint, AnomalyType, AnomalyScorePoint } from '../types';
import { PARAMETERS } from '../constants';

interface DashboardProps {
    telemetryData: TelemetryDataPoint[];
    anomalyScoreData: AnomalyScorePoint[];
    activeAnomaly: AnomalyType | null;
}

const AnomalyLabel = ({ viewBox, value }: any) => {
    const { x, y } = viewBox;
    return (
        <g transform={`translate(${x},${y})`}>
            <path d="M -70 15 L -62 7 L 62 7 L 70 15 L 70 35 L 62 43 L -62 43 L -70 35 Z" fill="rgba(255, 77, 77, 0.8)" />
            <text x={0} y={30} textAnchor="middle" fill="#fff" fontFamily="Orbitron" fontSize="12px" className="text-glow-danger">
                // ANOMALY //
            </text>
        </g>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ telemetryData, anomalyScoreData, activeAnomaly }) => {
    const combinedData = telemetryData.map((td, i) => ({
        ...td,
        anomalyScore: anomalyScoreData[i]?.score || 0,
    }));

    const anomalyTimestamp = activeAnomaly ? telemetryData.find(d => {
        if (activeAnomaly === 'CO2' && d.co2_ppm > 500) return true;
        if (activeAnomaly === 'O2' && d.o2_percent < 20) return true;
        if (activeAnomaly === 'PRESSURE' && d.pressure_kPa < 101) return true;
        if (activeAnomaly === 'WATER' && d.water_level_percent < 80) return true;
        return false;
    })?.timestamp : undefined;
    
    const timeFormatter = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    };

    return (
        <div className="sci-fi-panel p-4 flex-grow h-[35rem] flex flex-col">
             <h2 className="text-lg font-orbitron text-brand-accent text-glow-accent mb-4">LIVE TELEMETRY DASHBOARD</h2>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={combinedData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="anomalyScoreGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="co2Gradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ffcc00" />
                                <stop offset="100%" stopColor="#ff4d4d" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 255, 218, 0.1)" />
                        <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={timeFormatter} 
                            stroke="#8892b0"
                            fontFamily="Roboto Mono"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis yAxisId="y-co2" stroke={PARAMETERS.co2_ppm.color} orientation="right" domain={PARAMETERS.co2_ppm.domain} fontFamily="Roboto Mono" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="y-percent" stroke={PARAMETERS.o2_percent.color} orientation="left" domain={PARAMETERS.o2_percent.domain} fontFamily="Roboto Mono" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="y-pressure" stroke={PARAMETERS.pressure_kPa.color} orientation="left" domain={PARAMETERS.pressure_kPa.domain} tick={{ fontSize: 12 }} hide={true} />
                        <YAxis yAxisId="y-airflow" stroke={PARAMETERS.airflow_m_s.color} orientation="right" domain={PARAMETERS.airflow_m_s.domain} tick={{ fontSize: 12 }} hide={true} />
                        <YAxis yAxisId="y-score" domain={[0, 100]} orientation="left" stroke="#ff4d4d" tick={{ fontSize: 12 }} hide={true} />

                        <Tooltip
                            contentStyle={{
                                background: 'rgba(3, 8, 20, 0.9)',
                                border: '1px solid rgba(100, 255, 218, 0.3)',
                                fontFamily: 'Roboto Mono',
                            }}
                            labelFormatter={timeFormatter}
                            formatter={(value, name, props) => [`${(value as number).toFixed(2)} ${props.unit || ''}`, name]}
                        />
                        <Legend wrapperStyle={{fontFamily: "Orbitron", fontSize: "12px", bottom: -5}}/>

                        {Object.values(PARAMETERS).map(p => (
                            <Line 
                                key={p.key}
                                yAxisId={p.yAxisId}
                                type="monotone" 
                                dataKey={p.key} 
                                name={p.name}
                                stroke={p.key === 'co2_ppm' && activeAnomaly === 'CO2' ? 'url(#co2Gradient)' : p.color}
                                strokeWidth={p.key === 'co2_ppm' && activeAnomaly === 'CO2' ? 3 : 2}
                                dot={false}
                                unit={p.unit}
                            />
                        ))}
                        
                        <Area
                            yAxisId="y-score"
                            type="monotone"
                            dataKey="anomalyScore"
                            name="Anomaly Score"
                            fill="url(#anomalyScoreGradient)"
                            stroke="#ff4d4d"
                            strokeWidth={2}
                            dot={false}
                        />

                        {anomalyTimestamp && (
                            <ReferenceLine 
                                x={anomalyTimestamp} 
                                stroke="#ff4d4d" 
                                strokeWidth={2} 
                                strokeDasharray="8 4"
                                label={<AnomalyLabel />}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
