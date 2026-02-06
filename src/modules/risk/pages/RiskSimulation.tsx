import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { toast } from '../hooks/use-toast';
import { Zap, Play, BarChart } from 'lucide-react';

export default function RiskSimulation() {
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationProgress(0);

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          toast({
            title: "Simulation Complete",
            description: "Risk simulation has been completed successfully",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8" />
          Risk Simulation Engine
        </h1>
        <p className="text-muted-foreground mt-2">
          Run Monte Carlo simulations to predict risk outcomes and impact distributions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Simulation Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configure Simulation</CardTitle>
            <CardDescription>
              Set parameters for the risk simulation model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Select Scenario</Label>
              <Select>
                <SelectTrigger id="scenario">
                  <SelectValue placeholder="Choose a scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chemical-spill">Chemical Spill - Tank Puncture</SelectItem>
                  <SelectItem value="equipment-failure">Equipment Failure - Hydraulic System</SelectItem>
                  <SelectItem value="workplace-injury">Workplace Injury - Confined Space</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iterations">Number of Iterations</Label>
              <Input
                id="iterations"
                type="number"
                defaultValue="10000"
                placeholder="10000"
              />
              <p className="text-xs text-muted-foreground">
                More iterations provide more accurate results (recommended: 10,000+)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Base Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                defaultValue="30"
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact-min">Minimum Impact ($)</Label>
              <Input
                id="impact-min"
                type="number"
                defaultValue="125000"
                placeholder="125000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact-max">Maximum Impact ($)</Label>
              <Input
                id="impact-max"
                type="number"
                defaultValue="350000"
                placeholder="350000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence Level</Label>
              <Select defaultValue="95">
                <SelectTrigger id="confidence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleRunSimulation} 
              className="w-full" 
              disabled={isRunning}
            >
              <Play className="mr-2 h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>

            {isRunning && (
              <div className="space-y-2">
                <Progress value={simulationProgress} />
                <p className="text-sm text-center text-muted-foreground">
                  {simulationProgress}% complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About the Engine */}
        <Card>
          <CardHeader>
            <CardTitle>About the Simulation Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What is it?</h4>
              <p className="text-sm text-muted-foreground">
                The Risk Simulation Engine is the computational core that powers scenario modeling. 
                It runs sophisticated Monte Carlo simulations to predict a range of possible outcomes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Takes input parameters (probability, impact range, dependencies)</li>
                <li>Runs thousands of random iterations using statistical models</li>
                <li>Generates probabilistic distribution of outcomes</li>
                <li>Provides best case, worst case, and most likely scenarios</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Outputs:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Expected value (mean outcome)</li>
                <li>Value at Risk (VaR) at specified confidence levels</li>
                <li>Probability distribution curves</li>
                <li>Sensitivity analysis results</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">EHS Application:</h4>
              <p className="text-sm text-muted-foreground">
                For a chemical spill scenario, the engine calculates not just a single cost estimate, 
                but a full range: "There's a 95% chance the total cost will be between $125,000 and 
                $350,000, with the most likely outcome being $220,000."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Simulation Results
          </CardTitle>
          <CardDescription>
            Statistical analysis of risk outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Best Case</p>
              <p className="text-2xl font-bold text-green-600">$125,000</p>
              <p className="text-xs text-muted-foreground mt-1">10th percentile</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium text-muted-foreground mb-2">Most Likely</p>
              <p className="text-2xl font-bold">$220,000</p>
              <p className="text-xs text-muted-foreground mt-1">50th percentile (median)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Worst Case</p>
              <p className="text-2xl font-bold text-red-600">$350,000</p>
              <p className="text-xs text-muted-foreground mt-1">90th percentile</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Expected Value (Mean)</span>
                <span>$235,000</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Value at Risk (95% confidence)</span>
                <span>$340,000</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Standard Deviation</span>
                <span>$67,500</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
