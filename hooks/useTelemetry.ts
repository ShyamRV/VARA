import { useState, useEffect, useRef, useCallback } from 'react';
import { TelemetryDataPoint, AnomalyType, AnomalyScorePoint } from '../types';
import { TELEMETRY_UPDATE_INTERVAL, TELEMETRY_HISTORY_LENGTH } from '../constants';
import { calculateAnomalyScore } from '../services/anomalyDetector';

const generateInitialData = (): { telemetry: TelemetryDataPoint[], scores: AnomalyScorePoint[] } => {
    const now = Date.now();
    const telemetry: TelemetryDataPoint[] = [];
    const scores: AnomalyScorePoint[] = [];

    for (let i = 0; i < TELEMETRY_HISTORY_LENGTH; i++) {
        const timestamp = now - (TELEMETRY_HISTORY_LENGTH - i - 1) * TELEMETRY_UPDATE_INTERVAL;
        const t = timestamp / 10000;
        const point = {
            timestamp,
            co2_ppm: 400 + 5 * Math.sin(t * 0.7),
            o2_percent: 21 - 0.1 * Math.sin(t * 0.5),
            pressure_kPa: 101.3 + 0.05 * Math.sin(t * 0.3),
            water_level_percent: 85 + 2 * Math.sin(t * 0.2),
            humidity_percent: 50 + 5 * Math.sin(t * 0.4),
            scrubber_status: 1,
            airflow_m_s: 5.0 + 0.1 * Math.sin(t * 1.2),
            valve_command_status: 1,
        };
        telemetry.push(point);
        scores.push({ timestamp, score: calculateAnomalyScore(point) });
    }
    return { telemetry, scores };
};


export const useTelemetry = (isLive: boolean) => {
    const [data, setData] = useState(generateInitialData);
    const activeAnomalyRef = useRef<{ type: AnomalyType | null, startTime: number | null }>({ type: null, startTime: null });
    
    const latestDataPoint = data.telemetry[data.telemetry.length - 1];

    const injectAnomaly = useCallback((anomaly: AnomalyType) => {
        activeAnomalyRef.current = { type: anomaly, startTime: Date.now() };
    }, []);

    const resolveAnomaly = useCallback(() => {
        activeAnomalyRef.current = { type: null, startTime: null };
    }, []);

    useEffect(() => {
        if (!isLive) {
            return;
        }

        const interval = setInterval(() => {
            setData(({ telemetry: prevTelemetry, scores: prevScores }) => {
                const lastPoint = prevTelemetry[prevTelemetry.length - 1];
                const timestamp = Date.now();
                const t = timestamp / 10000;
                
                let newPoint: TelemetryDataPoint = {
                    timestamp,
                    co2_ppm: 400 + 5 * Math.sin(t * 0.7) + (Math.random() - 0.5),
                    o2_percent: 21 - 0.1 * Math.sin(t * 0.5) + (Math.random() - 0.5) * 0.05,
                    pressure_kPa: 101.3 + 0.05 * Math.sin(t * 0.3) + (Math.random() - 0.5) * 0.02,
                    water_level_percent: 85 + 2 * Math.sin(t * 0.2) + (Math.random() - 0.5) * 0.2,
                    humidity_percent: 50 + 5 * Math.sin(t * 0.4) + (Math.random() - 0.5),
                    scrubber_status: 1,
                    airflow_m_s: 5.0 + 0.1 * Math.sin(t * 1.2) + (Math.random() - 0.5) * 0.05,
                    valve_command_status: 1,
                };

                const { type, startTime } = activeAnomalyRef.current;
                if (type && startTime) {
                    const secondsSince = (timestamp - startTime) / 1000;
                    
                    switch (type) {
                        case 'CO2':
                            newPoint.co2_ppm += 1200 * (1 - Math.exp(-secondsSince / 5));
                            newPoint.airflow_m_s -= 3.5 * (1 - Math.exp(-secondsSince / 3));
                            newPoint.valve_command_status = 1; // Commanded open, but airflow is low
                            newPoint.scrubber_status = 0;
                            break;
                        case 'O2':
                            newPoint.o2_percent -= 4 * (1 - Math.exp(-secondsSince / 10));
                            break;
                        case 'PRESSURE':
                            newPoint.pressure_kPa -= 0.2 * secondsSince;
                            break;
                        case 'WATER':
                            newPoint.water_level_percent = Math.max(0, lastPoint.water_level_percent - 0.1 - (0.5 * (1 - Math.exp(-secondsSince / 15))));
                            newPoint.humidity_percent -= 15 * (1 - Math.exp(-secondsSince / 8));
                            break;
                    }
                } else {
                    // Gradual recovery for water after resolution
                    if (lastPoint.water_level_percent < 84) {
                       newPoint.water_level_percent = Math.min(85, lastPoint.water_level_percent + 0.05);
                    }
                }

                // Clamp values
                newPoint.airflow_m_s = Math.max(0, newPoint.airflow_m_s);
                newPoint.o2_percent = Math.max(0, newPoint.o2_percent);
                newPoint.water_level_percent = Math.max(0, newPoint.water_level_percent);
                
                const newScorePoint: AnomalyScorePoint = { timestamp, score: calculateAnomalyScore(newPoint) };

                const newTelemetry = [...prevTelemetry.slice(1), newPoint];
                const newScores = [...prevScores.slice(1), newScorePoint];
                
                return { telemetry: newTelemetry, scores: newScores };
            });
        }, TELEMETRY_UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [isLive]);

    return { telemetryData: data.telemetry, anomalyScoreData: data.scores, latestDataPoint, injectAnomaly, resolveAnomaly };
};
