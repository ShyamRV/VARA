import { TelemetryDataPoint, AnomalyType, DiagnosisResult } from '../types';

// 1. Information Model (Ontology/Knowledge Graph)
// Describes components, their relationships, and associated fault modes.
const INFORMATION_MODEL = {
    components: {
        'ECLSS': { affects: ['CO2Scrubber', 'OxygenGenerator', 'WaterRecycler', 'CabinPressureControl'] },
        'CO2Scrubber': { monitors: ['co2_ppm', 'airflow_m_s'], controls: ['valve_command_status'], status: 'scrubber_status', faults: ['ScrubberValveStuck', 'ScrubberSensorDrift'] },
        'OxygenGenerator': { monitors: ['o2_percent'], faults: ['O2SupplyLeak'] },
        'CabinPressureControl': { monitors: ['pressure_kPa'], faults: ['HullBreach'] },
        'WaterRecycler': { monitors: ['water_level_percent', 'humidity_percent'], faults: ['FiltrationFault'] },
    },
    faults: {
        'ScrubberValveStuck': {
            name: 'Scrubber Valve Stuck',
            symptoms: { co2_ppm: 'high', airflow_m_s: 'low', valve_command_status: 'high' },
            explanation: 'The scrubber valve is commanded open, but airflow is low, preventing CO2 removal.',
            recommendation: 'Cycle the scrubber valve immediately',
            action: 'Cycle Valve'
        },
        'ScrubberSensorDrift': {
            name: 'CO2 Sensor Drift',
            symptoms: { co2_ppm: 'high', airflow_m_s: 'normal' },
            explanation: 'The CO2 sensor is reading high, but other related telemetry (like airflow) appears normal.',
            recommendation: 'Cross-reference with secondary sensors and recalibrate',
            action: 'Recalibrate Sensor'
        },
        'O2SupplyLeak': {
            name: 'O2 Supply Leak',
            symptoms: { o2_percent: 'low' },
            explanation: 'A steady drop in oxygen points to a leak in the supply line or a faulty regulator.',
            recommendation: 'Activate reserve oxygen tank and locate the leak',
            action: 'Activate Reserve O₂'
        },
        'HullBreach': {
            name: 'Potential Hull Breach',
            symptoms: { pressure_kPa: 'low' },
            explanation: 'A continuous pressure drop is a critical indicator of a possible hull breach or seal failure.',
            recommendation: 'Isolate cabin section and verify suit integrity immediately',
            action: 'Isolate Section'
        },
        'FiltrationFault': {
            name: 'Water Filtration Fault',
            symptoms: { water_level_percent: 'low', humidity_percent: 'low' },
            explanation: 'Low water levels combined with a recycling system fault indicate a failure in water processing.',
            recommendation: 'Switch to backup water supply and restart the recycler',
            action: 'Switch to Backup Water'
        }
    }
};

/**
 * Simulates Probabilistic Graphical Model (PGM) inference.
 * It takes telemetry and ranks potential faults based on matching symptoms
 * from the information model.
 * @param point The anomalous telemetry data point.
 * @param anomalyType The general type of anomaly detected.
 * @returns An array of ranked DiagnosisResult objects.
 */
export const diagnoseFault = (point: TelemetryDataPoint, anomalyType: AnomalyType): DiagnosisResult[] => {
    let potentialFaults: string[] = [];
    switch (anomalyType) {
        case 'CO2': potentialFaults = INFORMATION_MODEL.components.CO2Scrubber.faults; break;
        case 'O2': potentialFaults = INFORMATION_MODEL.components.OxygenGenerator.faults; break;
        case 'PRESSURE': potentialFaults = INFORMATION_MODEL.components.CabinPressureControl.faults; break;
        case 'WATER': potentialFaults = INFORMATION_MODEL.components.WaterRecycler.faults; break;
    }

    const diagnosis: { faultKey: string, score: number }[] = potentialFaults.map(faultKey => {
        const fault = INFORMATION_MODEL.faults[faultKey as keyof typeof INFORMATION_MODEL.faults];
        let score = 0.1; // Base probability

        // FIX: Treat symptoms as a generic record to safely access properties that may not exist on all fault types.
        const symptoms: Record<string, string> = fault.symptoms;

        // Match symptoms to increase probability score
        if (symptoms.co2_ppm === 'high' && point.co2_ppm > 800) score += 0.4;
        if (symptoms.airflow_m_s === 'low' && point.airflow_m_s < 2.0) score += 0.3;
        if (symptoms.airflow_m_s === 'normal' && point.airflow_m_s > 4.0) score += 0.3;
        if (symptoms.valve_command_status === 'high' && point.valve_command_status === 1 && point.airflow_m_s < 2.0) {
            score += 0.5; // Very strong evidence
        }

        if (symptoms.o2_percent === 'low' && point.o2_percent < 19) score += 0.8;
        if (symptoms.pressure_kPa === 'low' && point.pressure_kPa < 100) score += 0.8;
        if (symptoms.water_level_percent === 'low' && point.water_level_percent < 50) score += 0.5;
        if (symptoms.humidity_percent === 'low' && point.humidity_percent < 40) score += 0.3;
        
        return { faultKey, score };
    });

    // Normalize scores to probabilities
    const totalScore = diagnosis.reduce((sum, d) => sum + d.score, 0);
    const rankedDiagnosis: DiagnosisResult[] = diagnosis
        .map(d => {
            const faultInfo = INFORMATION_MODEL.faults[d.faultKey as keyof typeof INFORMATION_MODEL.faults];
            return {
                fault: faultInfo.name,
                probability: totalScore > 0 ? d.score / totalScore : 0,
                explanation: faultInfo.explanation,
                recommendedAction: faultInfo.action,
            };
        })
        .sort((a, b) => b.probability - a.probability);

    return rankedDiagnosis;
};
