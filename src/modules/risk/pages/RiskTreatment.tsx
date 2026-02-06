import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Wrench, Target, Shield, Ban, ArrowRightLeft } from 'lucide-react';

export default function RiskTreatment() {
  const [selectedRisk, setSelectedRisk] = useState('');
  const [treatmentStrategy, setTreatmentStrategy] = useState('');

  const handleCreatePlan = () => {
    if (!selectedRisk || !treatmentStrategy) {
      toast({
        title: "Validation Error",
        description: "Please select a risk and treatment strategy",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Treatment Plan Created",
      description: "Risk treatment plan has been created successfully",
    });
  };

  const treatmentStrategies = [
    {
      id: 'treat',
      name: 'TREAT (Mitigate/Reduce)',
      icon: Shield,
      description: 'Implement controls to reduce likelihood or impact',
      color: 'bg-blue-500',
    },
    {
      id: 'terminate',
      name: 'TERMINATE (Eliminate/Avoid)',
      icon: Ban,
      description: 'Stop the activity or remove the hazard entirely',
      color: 'bg-red-500',
    },
    {
      id: 'transfer',
      name: 'TRANSFER (Insure/Outsource)',
      icon: ArrowRightLeft,
      description: 'Share or shift the risk to another party',
      color: 'bg-yellow-500',
    },
    {
      id: 'tolerate',
      name: 'TOLERATE (Accept/Retain)',
      icon: Target,
      description: 'Accept the risk when cost of mitigation exceeds benefit',
      color: 'bg-gray-500',
    },
  ];

  const existingPlans = [
    {
      id: 1,
      riskTitle: 'Heat Stress in Manufacturing Area',
      strategy: 'TREAT',
      actions: [
        'Implement worker rotation schedule (Administrative)',
        'Install air conditioning system (Engineering)',
        'Provide cooling vests (PPE)',
      ],
      owner: 'EHS Manager',
      deadline: '2024-02-28',
      budget: '$45,000',
      status: 'In Progress',
    },
    {
      id: 2,
      riskTitle: 'Chemical Exposure - Storage Area',
      strategy: 'TREAT',
      actions: [
        'Install ventilation system (Engineering)',
        'Provide chemical-resistant gloves (PPE)',
        'Mandatory training program (Administrative)',
      ],
      owner: 'Site Supervisor',
      deadline: '2024-03-15',
      budget: '$28,000',
      status: 'Planning',
    },
  ];

  const suggestedActions = {
    treat: [
      { type: 'Engineering Control', action: 'Install ventilation system' },
      { type: 'Administrative Control', action: 'Implement rotation schedule' },
      { type: 'PPE', action: 'Provide protective equipment' },
      { type: 'Training', action: 'Conduct safety training' },
    ],
    terminate: [
      { type: 'Process Change', action: 'Eliminate hazardous step' },
      { type: 'Substitution', action: 'Replace with safer alternative' },
      { type: 'Outsourcing', action: 'Contract to specialized vendor' },
    ],
    transfer: [
      { type: 'Insurance', action: 'Purchase liability coverage' },
      { type: 'Contract', action: 'Transfer to third party' },
      { type: 'Outsource', action: 'Use external service provider' },
    ],
    tolerate: [
      { type: 'Monitoring', action: 'Implement monitoring system' },
      { type: 'Emergency Plan', action: 'Develop response procedures' },
      { type: 'Financial Reserve', action: 'Set aside contingency budget' },
    ],
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          Risk Treatment Planner
        </h1>
        <p className="text-muted-foreground mt-2">
          Select optimal strategies and design action plans to manage identified risks
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Treatment Strategy Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Treatment Strategy</CardTitle>
              <CardDescription>
                Choose the most appropriate risk management approach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {treatmentStrategies.map((strategy) => {
                const Icon = strategy.icon;
                return (
                  <div
                    key={strategy.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      treatmentStrategy === strategy.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => setTreatmentStrategy(strategy.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${strategy.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{strategy.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {strategy.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Create Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Create Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-risk">Select Risk</Label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger id="select-risk">
                    <SelectValue placeholder="Choose a risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk1">Heat Stress in Manufacturing</SelectItem>
                    <SelectItem value="risk2">Chemical Exposure - Storage</SelectItem>
                    <SelectItem value="risk3">Fall from Height - Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actions">Mitigation Actions</Label>
                <Textarea
                  id="actions"
                  placeholder="List specific actions to be taken..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="owner">Action Owner</Label>
                  <Input id="owner" placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input id="budget" type="number" placeholder="45000" />
              </div>

              <Button onClick={handleCreatePlan} className="w-full">
                Create Treatment Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-6">
          {treatmentStrategy && (
            <Card>
              <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
                <CardDescription>
                  Recommended controls for {treatmentStrategies.find(s => s.id === treatmentStrategy)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedActions[treatmentStrategy as keyof typeof suggestedActions]?.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge variant="outline">{action.type}</Badge>
                      <p className="text-sm flex-1">{action.action}</p>
                      <Button size="sm" variant="ghost">Add</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>About Risk Treatment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The Risk Treatment Planner analyzes identified risks and helps select the most 
                effective strategy for managing them.
              </p>
              <div>
                <h4 className="font-semibold mb-2 text-sm">The 4 T's Framework:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>TREAT:</strong> Reduce risk through controls</li>
                  <li><strong>TERMINATE:</strong> Eliminate the hazard</li>
                  <li><strong>TRANSFER:</strong> Share risk via insurance or contracts</li>
                  <li><strong>TOLERATE:</strong> Accept risk when benefits outweigh costs</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                The tool helps assign owners, set deadlines, track budgets, and transform 
                risk data into structured action plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Treatment Plans */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Active Treatment Plans</h2>
        <div className="grid gap-4">
          {existingPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{plan.riskTitle}</CardTitle>
                    <CardDescription>Strategy: {plan.strategy}</CardDescription>
                  </div>
                  <Badge>{plan.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Mitigation Actions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {plan.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Owner</p>
                      <p className="text-sm text-muted-foreground">{plan.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">{plan.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-sm text-muted-foreground">{plan.budget}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit Plan</Button>
                    <Button size="sm" variant="outline">View Progress</Button>
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
