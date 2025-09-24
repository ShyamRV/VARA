
import { ParameterConfig, AnomalyType } from './types';

export const TELEMETRY_UPDATE_INTERVAL = 1000; // ms
export const TELEMETRY_HISTORY_LENGTH = 240; // number of data points to show

export const PARAMETERS: Record<string, ParameterConfig> = {
    co2_ppm: { key: 'co2_ppm', name: 'CO₂', unit: 'ppm', color: '#ffcc00', yAxisId: 'y-co2', domain: [350, 2000] },
    o2_percent: { key: 'o2_percent', name: 'Oxygen', unit: '%', color: '#64ffda', yAxisId: 'y-percent', domain: [15, 25] },
    pressure_kPa: { key: 'pressure_kPa', name: 'Pressure', unit: 'kPa', color: '#8892b0', yAxisId: 'y-pressure', domain: [95, 105] },
    water_level_percent: { key: 'water_level_percent', name: 'Water Level', unit: '%', color: '#7aa2f7', yAxisId: 'y-percent', domain: [0, 100] },
    humidity_percent: { key: 'humidity_percent', name: 'Humidity', unit: '%', color: '#f7768e', yAxisId: 'y-percent', domain: [30, 70] },
    airflow_m_s: { key: 'airflow_m_s', name: 'Airflow', unit: 'm/s', color: '#bb9af7', yAxisId: 'y-airflow', domain: [0, 6] },
};

export const ANOMALY_TYPES: AnomalyType[] = ['CO2', 'O2', 'PRESSURE', 'WATER'];

export const ANOMALY_DETAILS: Record<AnomalyType, { name: string, description: string }> = {
    CO2: { name: 'CO₂ Spike', description: 'Simulates a sudden increase in Carbon Dioxide levels.' },
    O2: { name: 'O₂ Drop', description: 'Simulates a dangerous drop in Oxygen concentration.' },
    PRESSURE: { name: 'Pressure Leak', description: 'Simulates a gradual loss of cabin pressure.' },
    WATER: { name: 'Water System Failure', description: 'Simulates a water recycling fault and level drop.' },
};
