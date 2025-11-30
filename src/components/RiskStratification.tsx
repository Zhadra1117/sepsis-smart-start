import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Activity, Shield, TrendingUp } from "lucide-react";

export interface RiskAssessment {
  mortalityRisk: "low" | "moderate" | "high" | "critical";
  mdrProbability: number;
  typicalPathogenProbability: number;
  atypicalPathogenProbability: number;
  severitLevel: string;
}

interface RiskStratificationProps {
  assessment: RiskAssessment;
}

export const RiskStratification = ({ assessment }: RiskStratificationProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-success text-success-foreground";
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "critical":
        return "bg-critical text-critical-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskLabel = (risk: string) => {
    return risk.charAt(0).toUpperCase() + risk.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Risk Stratification
              </CardTitle>
              <CardDescription>Based on clinical parameters and local epidemiology</CardDescription>
            </div>
            <Badge className={getRiskColor(assessment.mortalityRisk)} variant="default">
              {getRiskLabel(assessment.mortalityRisk)} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mortality Risk */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Mortality Risk</span>
              </div>
              <span className="text-sm font-semibold">{getRiskLabel(assessment.mortalityRisk)}</span>
            </div>
          </div>

          {/* MDR Probability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">MDR Organism Probability</span>
              </div>
              <span className="text-sm font-semibold">{assessment.mdrProbability}%</span>
            </div>
            <Progress value={assessment.mdrProbability} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {assessment.mdrProbability < 20
                ? "Low risk - consider narrower spectrum therapy"
                : assessment.mdrProbability < 40
                ? "Moderate risk - consider patient-specific factors"
                : "High risk - broader coverage may be warranted"}
            </p>
          </div>

          {/* Typical Pathogen Probability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Typical Pathogens (S. pneumoniae, H. influenzae)</span>
              </div>
              <span className="text-sm font-semibold">{assessment.typicalPathogenProbability}%</span>
            </div>
            <Progress value={assessment.typicalPathogenProbability} className="h-2" />
          </div>

          {/* Atypical Pathogen Probability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Atypical Pathogens (Legionella, Mycoplasma)</span>
              </div>
              <span className="text-sm font-semibold">{assessment.atypicalPathogenProbability}%</span>
            </div>
            <Progress value={assessment.atypicalPathogenProbability} className="h-2" />
          </div>

          {/* Severity Level */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Clinical Severity Assessment</p>
                <p className="text-sm text-muted-foreground mt-1">{assessment.severitLevel}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
