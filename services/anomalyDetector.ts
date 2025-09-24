import { TelemetryDataPoint } from '../types';

// Baseline "normal" operating conditions for the model to compare against.
const NORMAL_STATE = {
    co2_ppm: 400,
    o2_percent: 21,
    pressure_kPa: 101.3,
    water_level_percent: 85,
    humidity_percent: 50,
    airflow_m_s: 5.0,
};

// Weights for different parameters' contribution to the anomaly score.
// This simulates the sensitivity of the trained ML model.
const WEIGHTS = {
    co2_ppm: 0.4,
    o2_percent: 0.3,
    pressure_kPa: 0.2,
    water_level_percent: 0.25,
    humidity_percent: 0.1,
    airflow_m_s: 0.35,
    scrubber_status: 1.0, // A fault status is a huge anomaly
    valve_mismatch: 1.5, // A mismatch is a very strong indicator of a specific fault
};

/**
 * Simulates an unsupervised ML model (like a CAE) calculating a reconstruction error.
 * A higher score indicates a greater deviation from the learned "normal" state.
 * @param point The latest telemetry data point.
 * @returns A numeric anomaly score.
 */
export const calculateAnomalyScore = (point: TelemetryDataPoint): number => {
    let score = 0;

    // 1. Weighted deviation from baseline for individual sensors
    score += Math.abs(point.co2_ppm - NORMAL_STATE.co2_ppm) / 100 * WEIGHTS.co2_ppm;
    score += Math.abs(point.o2_percent - NORMAL_STATE.o2_percent) * WEIGHTS.o2_percent;
    score += Math.abs(point.pressure_kPa - NORMAL_STATE.pressure_kPa) * WEIGHTS.pressure_kPa;
    score += Math.abs(point.water_level_percent - NORMAL_STATE.water_level_percent) / 10 * WEIGHTS.water_level_percent;
    score += Math.abs(point.humidity_percent - NORMAL_STATE.humidity_percent) / 10 * WEIGHTS.humidity_percent;

    // 2. Causal/relational checks (more sophisticated part of the model)
    // Check for mismatch between valve command and airflow (a key indicator for CO2 issues)
    const airflowDeviation = Math.abs(point.airflow_m_s - NORMAL_STATE.airflow_m_s);
    if (point.valve_command_status === 1 && airflowDeviation > 1.0) {
        score += airflowDeviation * WEIGHTS.valve_mismatch;
    } else {
        score += airflowDeviation * WEIGHTS.airflow_m_s;
    }
    
    // 3. Status flags
    if (point.scrubber_status === 0) {
        score += WEIGHTS.scrubber_status;
    }

    // Clamp score between 0 and 1, then scale to 100
    const finalScore = Math.min(score, 1.2) / 1.2 * 100;
    return finalScore;
};
