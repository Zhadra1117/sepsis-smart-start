import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Info, Printer, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface TherapyRecommendation {
  primaryAntibiotic: string;
  dose: string;
  frequency: string;
  infusionDuration: string;
  route: string;
  secondaryAntibiotic?: string;
  secondaryDose?: string;
  secondaryFrequency?: string;
  renalAdjustment: string;
  reasoning: string;
  stewardshipNotes: string[];
  redFlags: string[];
  durationOfTherapy: string;
}

interface TherapyRecommendationProps {
  recommendation: TherapyRecommendation;
  onPrint?: () => void;
  onExport?: () => void;
}

export const TherapyRecommendation = ({
  recommendation,
  onPrint,
  onExport,
}: TherapyRecommendationProps) => {
  return (
    <div className="space-y-6">
      {/* Primary Recommendation Card */}
      <Card className="border-primary">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                Recommended Empiric Therapy
              </CardTitle>
              <CardDescription className="mt-2">
                Immediate antibiotic recommendation for pneumonia-induced sepsis
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onPrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Primary Antibiotic */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">Primary Agent</Badge>
              </div>
              <h3 className="text-2xl font-bold text-primary">{recommendation.primaryAntibiotic}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dose</p>
                <p className="text-lg font-semibold">{recommendation.dose}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Frequency</p>
                <p className="text-lg font-semibold">{recommendation.frequency}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="text-lg font-semibold">{recommendation.route}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Infusion Duration</p>
                <p className="text-lg font-semibold">{recommendation.infusionDuration}</p>
              </div>
            </div>
          </div>

          {/* Secondary Antibiotic if present */}
          {recommendation.secondaryAntibiotic && (
            <>
              <Separator />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-secondary text-secondary-foreground">Plus</Badge>
                  </div>
                  <h3 className="text-xl font-bold">{recommendation.secondaryAntibiotic}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Dose</p>
                    <p className="text-base font-semibold">{recommendation.secondaryDose}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="text-base font-semibold">{recommendation.secondaryFrequency}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Renal Adjustment */}
          {recommendation.renalAdjustment !== "None" && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">Renal Adjustment: </span>
                {recommendation.renalAdjustment}
              </AlertDescription>
            </Alert>
          )}

          {/* Duration */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Recommended Duration of Therapy</p>
            <p className="text-base font-semibold mt-1">{recommendation.durationOfTherapy}</p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Clinical Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{recommendation.reasoning}</p>
        </CardContent>
      </Card>

      {/* Stewardship Guidance */}
      {recommendation.stewardshipNotes.length > 0 && (
        <Card className="border-success/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              Antimicrobial Stewardship
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendation.stewardshipNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Red Flags and Warnings */}
      {recommendation.redFlags.length > 0 && (
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Important Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendation.redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{flag}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          This recommendation is a clinical decision support tool. Final prescribing decisions should
          incorporate clinical judgment, local guidelines, and patient-specific factors. Monitor for
          clinical response and adjust therapy as needed based on culture results and clinical course.
        </AlertDescription>
      </Alert>
    </div>
  );
};
