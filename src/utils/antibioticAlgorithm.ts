import { PatientData } from "@/components/ClinicalInputForm";
import { RiskAssessment } from "@/components/RiskStratification";
import { TherapyRecommendation } from "@/components/TherapyRecommendation";

export const calculateRiskAssessment = (data: PatientData): RiskAssessment => {
  // Calculate mortality risk based on SOFA, lactate, and vital signs
  let mortalityRisk: "low" | "moderate" | "high" | "critical" = "low";
  
  if (data.sofaScore >= 10 || data.lactate >= 4) {
    mortalityRisk = "critical";
  } else if (data.sofaScore >= 6 || data.lactate >= 2.5) {
    mortalityRisk = "high";
  } else if (data.sofaScore >= 2 || data.lactate >= 1.5) {
    mortalityRisk = "moderate";
  }

  // Calculate MDR probability based on risk factors
  let mdrProbability = 10; // Base probability
  
  if (data.recentAntibiotics === "within_30days") mdrProbability += 25;
  if (data.recentAntibiotics === "within_90days") mdrProbability += 15;
  if (data.recentAdmission) mdrProbability += 20;
  if (data.egfr < 30) mdrProbability += 10;
  
  mdrProbability = Math.min(mdrProbability, 80);

  // Calculate typical pathogen probability
  let typicalPathogenProbability = 70;
  if (data.age > 65) typicalPathogenProbability += 10;
  if (data.recentAntibiotics !== "none") typicalPathogenProbability -= 15;
  typicalPathogenProbability = Math.max(Math.min(typicalPathogenProbability, 90), 30);

  // Calculate atypical pathogen probability
  let atypicalPathogenProbability = 25;
  if (data.qsofaScore >= 2) atypicalPathogenProbability += 15;
  if (data.procalcitonin < 0.5) atypicalPathogenProbability += 10;
  atypicalPathogenProbability = Math.max(Math.min(atypicalPathogenProbability, 50), 10);

  // Determine severity level description
  let severitLevel = "";
  if (mortalityRisk === "critical") {
    severitLevel = "Septic shock with multiple organ dysfunction. Immediate aggressive therapy and ICU management required.";
  } else if (mortalityRisk === "high") {
    severitLevel = "Severe sepsis with organ dysfunction. Close monitoring and aggressive early therapy essential.";
  } else if (mortalityRisk === "moderate") {
    severitLevel = "Sepsis with moderate risk. Early appropriate therapy and monitoring recommended.";
  } else {
    severitLevel = "Lower severity sepsis. Standard therapy with close monitoring for deterioration.";
  }

  return {
    mortalityRisk,
    mdrProbability,
    typicalPathogenProbability,
    atypicalPathogenProbability,
    severitLevel,
  };
};

export const generateTherapyRecommendation = (
  data: PatientData,
  assessment: RiskAssessment
): TherapyRecommendation => {
  let recommendation: TherapyRecommendation = {
    primaryAntibiotic: "",
    dose: "",
    frequency: "",
    infusionDuration: "",
    route: "IV",
    renalAdjustment: "None",
    reasoning: "",
    stewardshipNotes: [],
    redFlags: [],
    durationOfTherapy: "5-7 days, reassess based on clinical response and culture results",
  };

  // Determine primary antibiotic based on MDR risk and severity
  if (assessment.mdrProbability < 20 && assessment.mortalityRisk !== "critical") {
    // Low MDR risk - β-lactam monotherapy or with macrolide
    recommendation.primaryAntibiotic = "Ceftriaxone";
    recommendation.dose = calculateCeftriaxoneDose(data);
    recommendation.frequency = "Once daily";
    recommendation.infusionDuration = "30 minutes";
    
    if (assessment.atypicalPathogenProbability > 20) {
      recommendation.secondaryAntibiotic = "Azithromycin";
      recommendation.secondaryDose = "500 mg";
      recommendation.secondaryFrequency = "Once daily";
      recommendation.reasoning = 
        "High probability of typical pneumococcal pneumonia with moderate atypical risk. " +
        "Ceftriaxone provides excellent coverage for S. pneumoniae and H. influenzae. " +
        "Azithromycin added for atypical coverage (Legionella, Mycoplasma). Low MDR risk supports narrower spectrum therapy.";
    } else {
      recommendation.reasoning = 
        "High probability of typical pneumococcal pneumonia with low atypical risk. " +
        "Ceftriaxone provides excellent coverage for S. pneumoniae and H. influenzae. " +
        "Low MDR risk supports β-lactam monotherapy, consistent with stewardship principles.";
    }
    
    recommendation.stewardshipNotes = [
      "Low MDR risk - avoiding carbapenem preserves this class for resistant organisms",
      "Narrow-spectrum β-lactam appropriate based on patient profile",
      "Plan to de-escalate if cultures negative at 48-72 hours",
    ];
    
  } else if (assessment.mdrProbability >= 20 && assessment.mdrProbability < 40) {
    // Moderate MDR risk - broader β-lactam
    recommendation.primaryAntibiotic = "Piperacillin-Tazobactam";
    recommendation.dose = calculatePipTazDose(data);
    recommendation.frequency = "Every 6 hours";
    recommendation.infusionDuration = "4 hours (extended infusion)";
    recommendation.secondaryAntibiotic = "Azithromycin";
    recommendation.secondaryDose = "500 mg";
    recommendation.secondaryFrequency = "Once daily";
    
    recommendation.reasoning = 
      "Moderate MDR risk with typical pneumonia presentation. " +
      "Piperacillin-tazobactam provides broader gram-negative coverage including ESBL risk. " +
      "Extended infusion optimizes time-dependent killing. Azithromycin for atypical coverage.";
    
    recommendation.stewardshipNotes = [
      "Extended infusion optimizes β-lactam pharmacodynamics",
      "Reassess at 48-72 hours for possible de-escalation based on cultures",
      "Monitor for Clostridioides difficile given broader spectrum",
    ];
    
  } else {
    // High MDR risk - consider carbapenem or double coverage
    recommendation.primaryAntibiotic = "Meropenem";
    recommendation.dose = calculateMeropenemDose(data);
    recommendation.frequency = "Every 8 hours";
    recommendation.infusionDuration = "3 hours (extended infusion)";
    recommendation.secondaryAntibiotic = "Levofloxacin";
    recommendation.secondaryDose = "750 mg";
    recommendation.secondaryFrequency = "Once daily";
    
    recommendation.reasoning = 
      "High MDR risk and/or severe sepsis/septic shock. " +
      "Meropenem provides broad coverage including ESBL-producing organisms. " +
      "Levofloxacin adds atypical and additional gram-negative coverage. " +
      "Aggressive empiric therapy justified by severity and MDR risk factors.";
    
    recommendation.stewardshipNotes = [
      "Carbapenem use justified by high MDR risk and clinical severity",
      "Critical to obtain quality cultures before administration",
      "Plan early de-escalation at 48-72 hours based on culture data",
    ];
    
    recommendation.redFlags = [
      "High MDR risk - ensure blood and respiratory cultures obtained",
      "Consider infectious disease consultation for complex case",
    ];
  }

  // Renal adjustments
  if (data.egfr < 30) {
    recommendation.renalAdjustment = applyRenalAdjustment(recommendation.primaryAntibiotic, data.egfr);
    recommendation.redFlags.push("Significant renal impairment - verify dose with pharmacist");
  } else if (data.egfr < 60) {
    recommendation.renalAdjustment = "Mild renal impairment - monitor creatinine, may require dose adjustment";
  }

  // Additional severity-based considerations
  if (assessment.mortalityRisk === "critical" || assessment.mortalityRisk === "high") {
    recommendation.redFlags.push("High mortality risk - ensure immediate administration (<1 hour)");
    recommendation.redFlags.push("Consider loading dose for optimal early exposure");
  }

  // Weight-based considerations
  if (data.weight > 100) {
    recommendation.redFlags.push("Obesity - verify weight-based dosing with pharmacist");
  }

  return recommendation;
};

const calculateCeftriaxoneDose = (data: PatientData): string => {
  if (data.sofaScore >= 6) {
    return "2 g";
  }
  return "1-2 g";
};

const calculatePipTazDose = (data: PatientData): string => {
  if (data.weight > 100 || data.sofaScore >= 6) {
    return "4.5 g";
  }
  return "4.5 g";
};

const calculateMeropenemDose = (data: PatientData): string => {
  if (data.sofaScore >= 6) {
    return "2 g";
  }
  return "1 g";
};

const applyRenalAdjustment = (antibiotic: string, egfr: number): string => {
  if (antibiotic === "Ceftriaxone") {
    return "Ceftriaxone: No dose adjustment needed for renal impairment (biliary excretion)";
  } else if (antibiotic === "Piperacillin-Tazobactam") {
    if (egfr < 20) {
      return "Severe renal impairment: Reduce to 2.25 g every 6-8 hours, consult nephrology/ID";
    }
    return "Moderate renal impairment: Consider 3.375 g every 6 hours or consult pharmacist";
  } else if (antibiotic === "Meropenem") {
    if (egfr < 20) {
      return "Severe renal impairment: Reduce to 500 mg every 12-24 hours, consult nephrology/ID";
    }
    return "Moderate renal impairment: Reduce to 500 mg-1 g every 12 hours";
  }
  return "Consult pharmacist for renal dosing adjustment";
};
