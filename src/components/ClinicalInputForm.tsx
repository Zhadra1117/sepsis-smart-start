import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface PatientData {
  // Demographics
  age: number;
  weight: number;
  sex: string;
  
  // Vitals
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  o2Saturation: number;
  respiratoryRate: number;
  temperature: number;
  
  // Labs
  wbc: number;
  crp: number;
  procalcitonin: number;
  lactate: number;
  creatinine: number;
  egfr: number;
  
  // Severity
  sofaScore: number;
  qsofaScore: number;
  
  // History
  recentAntibiotics: string;
  recentAdmission: boolean;
  comorbidities: string[];
}

interface ClinicalInputFormProps {
  onSubmit: (data: PatientData) => void;
}

export const ClinicalInputForm = ({ onSubmit }: ClinicalInputFormProps) => {
  const [formData, setFormData] = useState<Partial<PatientData>>({
    age: undefined,
    weight: undefined,
    sex: "",
    heartRate: undefined,
    systolicBP: undefined,
    diastolicBP: undefined,
    o2Saturation: undefined,
    respiratoryRate: undefined,
    temperature: undefined,
    wbc: undefined,
    crp: undefined,
    procalcitonin: undefined,
    lactate: undefined,
    creatinine: undefined,
    egfr: undefined,
    sofaScore: undefined,
    qsofaScore: undefined,
    recentAntibiotics: "",
    recentAdmission: false,
    comorbidities: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as PatientData);
  };

  const updateField = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="severity">Severity</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Basic patient information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="65"
                    value={formData.age || ""}
                    onChange={(e) => updateField("age", parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight || ""}
                    onChange={(e) => updateField("weight", parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select value={formData.sex} onValueChange={(value) => updateField("sex", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
              <CardDescription>Current vital measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="90"
                    value={formData.heartRate || ""}
                    onChange={(e) => updateField("heartRate", parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    placeholder="20"
                    value={formData.respiratoryRate || ""}
                    onChange={(e) => updateField("respiratoryRate", parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                  <Input
                    id="systolicBP"
                    type="number"
                    placeholder="120"
                    value={formData.systolicBP || ""}
                    onChange={(e) => updateField("systolicBP", parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                  <Input
                    id="diastolicBP"
                    type="number"
                    placeholder="80"
                    value={formData.diastolicBP || ""}
                    onChange={(e) => updateField("diastolicBP", parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="o2Saturation">O₂ Saturation (%)</Label>
                  <Input
                    id="o2Saturation"
                    type="number"
                    placeholder="95"
                    value={formData.o2Saturation || ""}
                    onChange={(e) => updateField("o2Saturation", parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="38.5"
                  value={formData.temperature || ""}
                  onChange={(e) => updateField("temperature", parseFloat(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Recent lab values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wbc">WBC (×10⁹/L)</Label>
                  <Input
                    id="wbc"
                    type="number"
                    step="0.1"
                    placeholder="12.5"
                    value={formData.wbc || ""}
                    onChange={(e) => updateField("wbc", parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crp">CRP (mg/L)</Label>
                  <Input
                    id="crp"
                    type="number"
                    placeholder="150"
                    value={formData.crp || ""}
                    onChange={(e) => updateField("crp", parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="procalcitonin">Procalcitonin (ng/mL)</Label>
                  <Input
                    id="procalcitonin"
                    type="number"
                    step="0.01"
                    placeholder="2.5"
                    value={formData.procalcitonin || ""}
                    onChange={(e) => updateField("procalcitonin", parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lactate">Lactate (mmol/L)</Label>
                  <Input
                    id="lactate"
                    type="number"
                    step="0.1"
                    placeholder="3.2"
                    value={formData.lactate || ""}
                    onChange={(e) => updateField("lactate", parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creatinine">Creatinine (μmol/L)</Label>
                  <Input
                    id="creatinine"
                    type="number"
                    placeholder="110"
                    value={formData.creatinine || ""}
                    onChange={(e) => updateField("creatinine", parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="egfr">eGFR (mL/min/1.73m²)</Label>
                  <Input
                    id="egfr"
                    type="number"
                    placeholder="60"
                    value={formData.egfr || ""}
                    onChange={(e) => updateField("egfr", parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="severity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Severity Assessment</CardTitle>
              <CardDescription>Clinical severity scores and history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sofaScore">SOFA Score</Label>
                  <Input
                    id="sofaScore"
                    type="number"
                    placeholder="4"
                    value={formData.sofaScore || ""}
                    onChange={(e) => updateField("sofaScore", parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qsofaScore">qSOFA Score</Label>
                  <Input
                    id="qsofaScore"
                    type="number"
                    placeholder="2"
                    value={formData.qsofaScore || ""}
                    onChange={(e) => updateField("qsofaScore", parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recentAntibiotics">Recent Antibiotics</Label>
                <Select
                  value={formData.recentAntibiotics}
                  onValueChange={(value) => updateField("recentAntibiotics", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select if applicable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="within_30days">Within 30 days</SelectItem>
                    <SelectItem value="within_90days">Within 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" size="lg" className="w-full">
        Calculate Recommendation
      </Button>
    </form>
  );
};
