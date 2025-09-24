import React, { useState, useEffect, useCallback } from 'react';
import { useTelemetry } from './hooks/useTelemetry';
import { useVaraTTS } from './hooks/useVaraTTS';
import { AnomalyType, DiagnosisResult } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import Dashboard from './components/Dashboard';
import DiagnosisPanel from './components/DiagnosisPanel';
import Explainability from './components/Explainability';
import VaraHologram from './components/VaraHologram';
import { diagnoseFault } from './services/digitalTwin';

const ANOMALY_SCORE_THRESHOLD = 50; // ML model flags anomaly above this score
const ANOMALY_COOLDOWN = 5000; // 5 seconds before a new anomaly can be diagnosed

const App: React.FC = () => {
    const [isLive, setIsLive] = useState(true);
    const [injectedAnomaly, setInjectedAnomaly] = useState<AnomalyType | null>(null);
    const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisResult[] | null>(null);
    const [lastAnomalyTime, setLastAnomalyTime] = useState(0);

    const { telemetryData, anomalyScoreData, injectAnomaly, resolveAnomaly, latestDataPoint } = useTelemetry(isLive);
    const { speak, isSpeaking } = useVaraTTS();

    const handleInjectAnomaly = useCallback((anomaly: AnomalyType) => {
        if (injectedAnomaly) return;
        setInjectedAnomaly(anomaly);
        injectAnomaly(anomaly);
        setActiveDiagnosis(null);
    }, [injectedAnomaly, injectAnomaly]);

    const handleResolveAnomaly = useCallback(() => {
        if (!activeDiagnosis) return;
        const topFault = activeDiagnosis[0];
        const message = `${topFault.recommendedAction} action applied. Monitoring system for stabilization.`;
        speak(message);
        resolveAnomaly();
        setInjectedAnomaly(null);
        setActiveDiagnosis(null);
    }, [activeDiagnosis, resolveAnomaly, speak]);
    
    // This effect runs the core logic: Detect -> Diagnose -> Speak
    useEffect(() => {
        // Guard clauses to prevent running when not needed
        if (!latestDataPoint || !injectedAnomaly || activeDiagnosis || isSpeaking) {
            return;
        }

        const latestScore = anomalyScoreData[anomalyScoreData.length - 1]?.score || 0;
        const now = Date.now();
        
        // DETECT: Unsupervised ML model flags an anomaly
        if (latestScore > ANOMALY_SCORE_THRESHOLD && (now - lastAnomalyTime > ANOMALY_COOLDOWN)) {
             // DIAGNOSE: Consult the digital twin
            const diagnosis = diagnoseFault(latestDataPoint, injectedAnomaly);
            if (diagnosis.length > 0) {
                setActiveDiagnosis(diagnosis);
                setLastAnomalyTime(now);

                // ACT: Announce the diagnosis immediately
                const topFault = diagnosis[0];
                const diagnosisMsg = `Anomaly detected. Digital twin inference suggests a ${Math.round(topFault.probability * 100)} percent probability of: ${topFault.fault}. ${topFault.explanation} Recommend to ${topFault.recommendedAction}.`;
                speak(diagnosisMsg);
            }
        }

    }, [
        latestDataPoint, 
        anomalyScoreData, 
        injectedAnomaly, 
        activeDiagnosis, 
        lastAnomalyTime, 
        isSpeaking, 
        speak
    ]);

    return (
        <div className="min-h-screen bg-brand-bg font-sans p-4 lg:p-6 flex flex-col max-w-screen-2xl mx-auto">
            <Header />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                {/* Left Column */}
                <div className="lg:col-span-3">
                    <Controls
                        isLive={isLive}
                        onToggleLive={() => setIsLive(prev => !prev)}
                        onInjectAnomaly={handleInjectAnomaly}
                        activeAnomaly={injectedAnomaly}
                        anomalyScore={anomalyScoreData[anomalyScoreData.length - 1]?.score || 0}
                    />
                </div>

                {/* Center Column */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <Dashboard 
                        telemetryData={telemetryData} 
                        anomalyScoreData={anomalyScoreData}
                        activeAnomaly={injectedAnomaly} 
                    />
                    <Explainability telemetryData={telemetryData} activeDiagnosis={activeDiagnosis} />
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                     <VaraHologram isSpeaking={isSpeaking} />
                     <DiagnosisPanel
                        latestDataPoint={latestDataPoint}
                        diagnosisResult={activeDiagnosis}
                        onResolveAnomaly={handleResolveAnomaly}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;