import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const RiskMatrix = () => {
  const severityLevels = [
    { value: 1, label: "Negligible" },
    { value: 2, label: "Minor" },
    { value: 3, label: "Moderate" },
    { value: 4, label: "Major" },
    { value: 5, label: "Catastrophic" },
  ];

  const likelihoodLevels = [
    { value: 1, label: "Rare" },
    { value: 2, label: "Unlikely" },
    { value: 3, label: "Possible" },
    { value: 4, label: "Likely" },
    { value: 5, label: "Almost Certain" },
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 15) return "bg-status-error text-white";
    if (risk >= 10) return "bg-status-warning text-white";
    if (risk >= 5) return "bg-status-caution text-white";
    return "bg-status-success text-white";
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 15) return "Critical";
    if (risk >= 10) return "High";
    if (risk >= 5) return "Medium";
    return "Low";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Matrix Evaluation</h1>
        <p className="text-muted-foreground">Evaluate and visualize risk levels</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Severity Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {severityLevels.map((level) => (
              <div key={level.value} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{level.value}</Badge>
                  <span className="font-medium">{level.label}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Likelihood Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {likelihoodLevels.map((level) => (
              <div key={level.value} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{level.value}</Badge>
                  <span className="font-medium">{level.label}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted text-left">Likelihood / Severity</th>
                  {severityLevels.map((s) => (
                    <th key={s.value} className="border p-2 bg-muted text-center min-w-[100px]">
                      {s.value}<br />
                      <span className="text-xs">{s.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...likelihoodLevels].reverse().map((l) => (
                  <tr key={l.value}>
                    <td className="border p-2 bg-muted font-medium">
                      {l.value} - {l.label}
                    </td>
                    {severityLevels.map((s) => {
                      const risk = l.value * s.value;
                      return (
                        <td key={s.value} className={`border p-4 text-center ${getRiskColor(risk)}`}>
                          <div className="font-bold text-lg">{risk}</div>
                          <div className="text-xs">{getRiskLevel(risk)}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <Label className="font-semibold mb-2 block">Risk Rating Guide:</Label>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-status-success" />
                <span>Low (1-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-status-caution" />
                <span>Medium (5-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-status-warning" />
                <span>High (10-14)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-status-error" />
                <span>Critical (15-25)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button>Continue</Button>
      </div>
    </div>
  );
};

export default RiskMatrix;
