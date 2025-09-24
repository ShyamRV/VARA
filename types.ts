export type AnomalyType = 'CO2' | 'O2' | 'PRESSURE' | 'WATER';

export interface TelemetryDataPoint {
    timestamp: number;
    co2_ppm: number;
    o2_percent: number;
    pressure_kPa: number;
    water_level_percent: number;
    humidity_percent: number;
    scrubber_status: number; // 1 for OK, 0 for FAULT
    airflow_m_s: number;
    valve_command_status: number; // 1 for OPEN, 0 for CLOSED
}

export interface ParameterConfig {
    key: keyof TelemetryDataPoint;
    name: string;
    unit: string;
    color: string;
    yAxisId: string;
    domain: [number, number];
}

export interface DiagnosisResult {
    fault: string;
    probability: number;
    explanation: string;
    recommendedAction: string;
}

export interface AnomalyScorePoint {
    timestamp: number;
    score: number;
}
