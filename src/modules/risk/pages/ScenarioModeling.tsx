import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';
import { Plus, Play } from 'lucide-react';

export default function ScenarioModeling() {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioType, setScenarioType] = useState('');
  const [description, setDescription] = useState('');
  const [probability, setProbability] = useState('');
  const [financialImpact, setFinancialImpact] = useState('');

  const handleCreateScenario = () => {
    if (!scenarioName || !scenarioType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Scenario Created",
      description: `Scenario "${scenarioName}" has been created successfully`,
    });

    // Reset form
    setScenarioName('');
    setScenarioType('');
    setDescription('');
    setProbability('');
    setFinancialImpact('');
  };

  const handleRunSimulation = (scenario: string) => {
    toast({
      title: "Simulation Running",
      description: `Running simulation for "${scenario}"...`,
    });
  };

  const existingScenarios = [
    {
      id: 1,
      name: 'Chemical Spill - Tank Puncture',
      type: 'Environmental',
      probability: 'Medium (30%)',
      estimatedCost: '$125,000 - $350,000',
      downtime: '3-7 days',
    },
    {
      id: 2,
      name: 'Equipment Failure - Hydraulic System',
      type: 'Operational',
      probability: 'High (45%)',
      estimatedCost: '$45,000 - $85,000',
      downtime: '1-2 days',
    },
    {
      id: 3,
      name: 'Workplace Injury - Confined Space',
      type: 'Safety',
      probability: 'Low (15%)',
      estimatedCost: '$200,000 - $500,000',
      downtime: '0 days',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Scenario Risk Modeling</h1>
        <p className="text-muted-foreground mt-2">
          Create and simulate hypothetical risk scenarios to quantify potential impacts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create New Scenario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Scenario
            </CardTitle>
            <CardDescription>
              Define a "what-if" event to model its potential impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name *</Label>
              <Input
                id="scenario-name"
                placeholder="e.g., Major Chemical Spill"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenario-type">Risk Type *</Label>
              <Select value={scenarioType} onValueChange={setScenarioType}>
                <SelectTrigger id="scenario-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="reputational">Reputational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the scenario in detail..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  placeholder="30"
                  value={probability}
                  onChange={(e) => setProbability(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financial-impact">Est. Financial Impact ($)</Label>
                <Input
                  id="financial-impact"
                  type="number"
                  placeholder="125000"
                  value={financialImpact}
                  onChange={(e) => setFinancialImpact(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleCreateScenario} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Scenario
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Scenario Modeling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What is Scenario Risk Modeling?</h4>
              <p className="text-sm text-muted-foreground">
                A proactive technique to quantify and understand the potential impact of hypothetical, 
                yet plausible, risk events before they occur.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Benefits</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Calculate estimated cleanup costs</li>
                <li>Predict regulatory reporting time</li>
                <li>Estimate potential fines and penalties</li>
                <li>Assess medical and injury costs</li>
                <li>Determine facility shutdown duration</li>
                <li>Budget for mitigation and emergency response</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Use Case</h4>
              <p className="text-sm text-muted-foreground">
                "What if a forklift punctured a storage tank of hazardous material?" The model 
                simulates all downstream impacts across financial, operational, safety, and 
                regulatory dimensions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Scenarios */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Existing Scenarios</h2>
        <div className="grid gap-4">
          {existingScenarios.map((scenario) => (
            <Card key={scenario.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{scenario.name}</CardTitle>
                    <CardDescription>Type: {scenario.type}</CardDescription>
                  </div>
                  <Button onClick={() => handleRunSimulation(scenario.name)}>
                    <Play className="mr-2 h-4 w-4" />
                    Run Simulation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Probability</p>
                    <p className="text-lg">{scenario.probability}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Cost</p>
                    <p className="text-lg">{scenario.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Potential Downtime</p>
                    <p className="text-lg">{scenario.downtime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
