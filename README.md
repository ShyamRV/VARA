# VARA: An Integrated AI for Autonomous ECLSS Fault Management

**Authors:** Shyamji Pandey, Niharika J, Bhaav Goel, Sridhar S, Nishmitha P, and Deepa Kaur

---

## Overview
Deep-space habitats and spacecraft need onboard fault detection, diagnosis, and response in life support (ECLSS) and related systems because ground control is delayed or absent. Recent papers note that current FDD (fault detection & diagnosis) relies on ground experts and isolated modules. 

For example:
- **Carbone et al. (2023)** show that even electrical power systems (EPS) on spacecraft require a combination of model-based and knowledge-based FDD to reach high reliability [1].  
- **Gratius et al. (2024)** emphasize that ECLSS models today are fragmented by subsystem, making on-board anomaly response difficult [2].  
- **Stottler et al. (2020)** describe a hybrid model+ML approach for subsystem FDIR (fault detection, isolation, and recovery) on-board satellites, but note the need to integrate these and plan recovery in a closed loop [3].  

In all cases the gap is a **unified, autonomous pipeline**: anomalies can be detected (often by ML), but linking that to causal diagnosis and actionable decisions in a single system – with minimal crew/ground involvement – remains an open challenge.

---

## Key Issues
- **Telemetry:** Spacecraft telemetry are high-dimensional and multivariate, so unsupervised ML is common for anomaly detection.  
- **ML Approaches:** Wang & Jahanshahi (2025) use convolutional autoencoders (CAEs) for anomalies in habitat temperature/pressure sensors [4].  
- **Hybrid Schemes:** Carbone et al. (2023) use hierarchical model-based + knowledge-based frameworks [1]; Stottler et al. fuse model-based checks with SOM anomaly detection [3].  
- **Toolchains:** ISS Columbus "KISS" project builds AI toolchains that identify faults, suggest reconfiguration, and support MLOps [5].  
- **Digital Twins:** Gratius et al. (2024) propose twins merging semantic models with simulations, updated by telemetry for detection, diagnosis, and decision-making [2][6].  

Challenges remain:  
- ML detectors lack transparency [4][9].  
- Physics/PGM twins provide causality but output complex probabilities not intuitive for crew.  
- No system ties ML detection, root-cause reasoning, prognosis, and explainability into one agent.  

---

## Proposed Integrated Digital-Twin Approach
We propose a **cognitive digital twin** for ECLSS that integrates ML anomaly detection, model-based reasoning, and explainability into an autonomous assistant.

### Features:
1. **Information Model:** Ontology/Knowledge Graph of components, sensors, functions.  
2. **Simulation Model:** Physics-based or probabilistic graphical models (PGM).  
3. **ML Detection:** CAE/SOM for continuous monitoring [3][4].  
4. **Fault Diagnosis:** Twin queries information + simulation models to infer causes.  
5. **What-If Prognosis:** Twin simulates scenarios and compares mitigation options [6].  
6. **Autonomous Action:** Suggests recovery plans (OODA Decide & Act).  
7. **XAI Component:** Crew-facing explanations of anomalies, causes, and recommendations.  

**Example:**  
If CO₂ sensor readings spike, VARA infers 90% likelihood that a controller valve is stuck closed. Simulation predicts CO₂ exceedance in 3 hours. VARA recommends cycling the valve and explains reasoning to crew.

---

## Application in VARA (Onboard AI Assistant)
VARA functions as a **voice/AR assistant**:  
- Monitors telemetry in real-time.  
- Proactively informs crew of anomalies.  
- Presents causes, mitigation options, and walk-throughs.  
- Allows interactive Q&A: crew can ask “Why do you think the scrubber failed?” and get an evidence-based explanation.  

This closes the loop between automated detection, causal reasoning, and human oversight, building trust and autonomy.

---

## Benefits
- **Autonomous:** Reduces reliance on ground intervention.  
- **Explainable:** Crew can understand and trust system decisions.  
- **Unified:** ML detection, reasoning, prognosis, and action integrated into one loop.  
- **Adaptive:** Uses synthetic fault scenarios + MLOps for continual learning [12][2].  

---

## References
[1] Fault Detection and Diagnosis in Spacecraft Electrical Power Systems  
file://file-RNp7PNn1AojbzGq5NwoBQF  

[2][6][11] *Digital Twin Technologies for Autonomous Environmental Control and Life Support Systems*  
file://file-UKhfC92icGxCiw9mAGB6B2  

[3] *AMOS Hybrid Paper*  
https://amostech.com/TechnicalPapers/2020/Machine-Learning-Applications-of-SSA/Stottler.pdf  

[4] *NASA Technical Reports (2025)*  
https://ntrs.nasa.gov/api/citations/20250002072/downloads/PDF_R1_Clean_Version.pdf  

[5][10] *AI-based Toolchain for Anomaly Detection, Diagnosis, and Reconfiguration for ISS COLUMBUS Module*  
https://link.springer.com/article/10.1007/s12567-025-00654-3  

[7][8] *Probabilistic Graphical Model-based Digital Twins: Space Habitat Study*  
https://www.researchgate.net/publication/370034412  

[9][12] *A Review of Anomaly Detection in Spacecraft Telemetry Data*  
https://www.mdpi.com/2076-3417/15/10/5653  

## Application

View the app in AI Studio: https://ai.studio/apps/drive/1LbGNEIj7WbNlKv1VrAWir3u-IOj3H1Q0
