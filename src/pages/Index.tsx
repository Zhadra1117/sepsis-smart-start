import { useState } from "react";
import { ClinicalInputForm, PatientData } from "@/components/ClinicalInputForm";
import { RiskStratification, RiskAssessment } from "@/components/RiskStratification";
import { TherapyRecommendation as TherapyRecommendationComponent } from "@/components/TherapyRecommendation";
import { calculateRiskAssessment, generateTherapyRecommendation } from "@/utils/antibioticAlgorithm";
import { Button } from "@/components/ui/button";
import { Activity, ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ViewState = "input" | "results";

const Index = () => {
  const [viewState, setViewState] = useState<ViewState>("input");
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [therapyRecommendation, setTherapyRecommendation] = useState<any>(null);

  const handleFormSubmit = (data: PatientData) => {
    const assessment = calculateRiskAssessment(data);
    const recommendation = generateTherapyRecommendation(data, assessment);
    
    setRiskAssessment(assessment);
    setTherapyRecommendation(recommendation);
    setViewState("results");
  };

  const handleReset = () => {
    setViewState("input");
    setRiskAssessment(null);
    setTherapyRecommendation(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Future implementation: export to PDF or EMR
    console.log("Export functionality - to be implemented");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SEPSIS-ABX Algorithm</h1>
                <p className="text-sm text-muted-foreground">
                  Intelligent Antibiotic Decision Support for Pneumonia-Induced Sepsis (55+)
                </p>
              </div>
            </div>
            {viewState === "results" && (
              <Button variant="outline" onClick={handleReset}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {viewState === "input" ? (
          <div className="max-w-4xl mx-auto">
            {/* Introduction Card */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Clinical Decision Support System
                </CardTitle>
                <CardDescription>
                  This algorithm helps frontline physicians choose optimal empiric antibiotic therapy for
                  pneumonia-induced sepsis in patients aged 55 and older. It provides data-driven
                  recommendations based on clinical parameters, severity scores, and antimicrobial
                  stewardship principles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">Before you begin:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Ensure patient meets inclusion criteria (age ≥55, pneumonia-induced sepsis)</li>
                    <li>Obtain blood cultures and respiratory cultures before antibiotic administration</li>
                    <li>Have recent vital signs and laboratory results available</li>
                    <li>Calculate SOFA and qSOFA scores if not already done</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Input Form */}
            <ClinicalInputForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Results Header */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Assessment Complete</CardTitle>
                <CardDescription>
                  Review the risk stratification and therapy recommendation below. This recommendation
                  should be integrated with clinical judgment and institutional guidelines.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Risk Stratification */}
              <div>
                {riskAssessment && <RiskStratification assessment={riskAssessment} />}
              </div>

              {/* Therapy Recommendation */}
              <div>
                {therapyRecommendation && (
                  <TherapyRecommendationComponent
                    recommendation={therapyRecommendation}
                    onPrint={handlePrint}
                    onExport={handleExport}
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={handleReset} size="lg">
                New Assessment
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Clinical Decision Support Tool for Healthcare Professionals
            </p>
            <p className="text-xs text-muted-foreground">
              This tool is intended for use by qualified healthcare professionals as a decision support
              aid. All prescribing decisions must incorporate clinical judgment, local guidelines, and
              patient-specific factors. Not a substitute for professional medical judgment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
