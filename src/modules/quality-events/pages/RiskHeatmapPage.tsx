import React, { useState } from 'react';
import { AlertTriangle, Info, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { StatusBadge, PriorityBadge } from '../components/ui/status-badge';

interface RiskCell {
  probability: number;
  impact: number;
  items: Array<{
    id: string;
    title: string;
    type: 'event' | 'incident';
    status: string;
  }>;
}

export default function RiskHeatmapPage() {
  const { qualityEvents, incidents } = useQualityEvents();
  const [filterType, setFilterType] = useState<'all' | 'events' | 'incidents'>('all');
  const [selectedCell, setSelectedCell] = useState<RiskCell | null>(null);

  // Define risk matrix
  const probabilityLabels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
  const impactLabels = ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'];

  // Map items to risk matrix based on their risk scores
  const getRiskMatrix = (): RiskCell[][] => {
    const matrix: RiskCell[][] = Array(5).fill(null).map(() => 
      Array(5).fill(null).map(() => ({ probability: 0, impact: 0, items: [] }))
    );

    // Add events
    if (filterType !== 'incidents') {
      qualityEvents.forEach(event => {
        // Convert risk score to probability/impact (simplified logic)
        const prob = Math.min(Math.floor(event.riskScore / 20), 4);
        const impact = event.priority === 'critical' ? 4 : 
                      event.priority === 'high' ? 3 :
                      event.priority === 'medium' ? 2 : 
                      event.priority === 'low' ? 1 : 0;
        
        if (!matrix[4-prob][impact]) {
          matrix[4-prob][impact] = { probability: prob, impact, items: [] };
        }
        matrix[4-prob][impact].items.push({
          id: event.id,
          title: event.title,
          type: 'event',
          status: event.status,
        });
      });
    }

    // Add incidents
    if (filterType !== 'events') {
      incidents.forEach(incident => {
        const prob = incident.severity === 'critical' ? 4 :
                    incident.severity === 'major' ? 3 :
                    incident.severity === 'minor' ? 2 : 1;
        const impact = prob; // For simplicity, using same value
        
        if (!matrix[4-prob][impact]) {
          matrix[4-prob][impact] = { probability: prob, impact, items: [] };
        }
        matrix[4-prob][impact].items.push({
          id: incident.id,
          title: incident.title,
          type: 'incident',
          status: incident.status,
        });
      });
    }

    return matrix;
  };

  const getCellColor = (row: number, col: number) => {
    const riskLevel = (4 - row) + col; // 0-8 scale
    if (riskLevel >= 6) return 'bg-destructive/80 hover:bg-destructive';
    if (riskLevel >= 4) return 'bg-orange-500/80 hover:bg-orange-500';
    if (riskLevel >= 2) return 'bg-yellow-500/80 hover:bg-yellow-500';
    return 'bg-green-500/80 hover:bg-green-500';
  };

  const getRiskLevelText = (row: number, col: number) => {
    const riskLevel = (4 - row) + col;
    if (riskLevel >= 6) return 'Critical';
    if (riskLevel >= 4) return 'High';
    if (riskLevel >= 2) return 'Medium';
    return 'Low';
  };

  const matrix = getRiskMatrix();

  // Statistics
  const totalEvents = filterType !== 'incidents' ? qualityEvents.length : 0;
  const totalIncidents = filterType !== 'events' ? incidents.length : 0;
  const criticalRisks = matrix.flat().filter((_, idx) => {
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    return (4 - row) + col >= 6;
  }).reduce((sum, cell) => sum + cell.items.length, 0);
  const highRisks = matrix.flat().filter((_, idx) => {
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    const level = (4 - row) + col;
    return level >= 4 && level < 6;
  }).reduce((sum, cell) => sum + cell.items.length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-warning" />
          <div>
            <h1 className="text-2xl font-bold">Risk Heatmap</h1>
            <p className="text-muted-foreground">Visual risk assessment matrix for events and incidents</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="events">Events Only</SelectItem>
              <SelectItem value="incidents">Incidents Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalEvents + totalIncidents}</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">{criticalRisks}</p>
            <p className="text-sm text-muted-foreground">Critical Risk Zone</p>
          </CardContent>
        </Card>
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-500">{highRisks}</p>
            <p className="text-sm text-muted-foreground">High Risk Zone</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalEvents}</p>
            <p className="text-sm text-muted-foreground">Events / {totalIncidents} Incidents</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Risk Assessment Matrix
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Click on any cell to see the items in that risk category. 
                The heatmap shows risk based on probability (likelihood) and impact (severity).
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>Click cells to view items in each risk category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col justify-center mr-2">
              <span className="text-sm font-medium text-muted-foreground transform -rotate-90 whitespace-nowrap">
                Probability →
              </span>
            </div>

            {/* Y-axis labels */}
            <div className="flex flex-col justify-around mr-2 py-2">
              {probabilityLabels.slice().reverse().map((label) => (
                <span key={label} className="text-xs text-muted-foreground h-16 flex items-center">
                  {label}
                </span>
              ))}
            </div>

            {/* Matrix Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1">
                {matrix.map((row, rowIdx) =>
                  row.map((cell, colIdx) => (
                    <Tooltip key={`${rowIdx}-${colIdx}`}>
                      <TooltipTrigger asChild>
                        <button
                          className={`h-16 rounded-md flex items-center justify-center text-white font-bold transition-all ${getCellColor(rowIdx, colIdx)} ${cell.items.length > 0 ? 'cursor-pointer ring-2 ring-white/20' : 'cursor-default opacity-70'}`}
                          onClick={() => cell.items.length > 0 && setSelectedCell(cell)}
                        >
                          {cell.items.length > 0 ? cell.items.length : ''}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{getRiskLevelText(rowIdx, colIdx)} Risk</p>
                          <p className="text-xs">{cell.items.length} item(s)</p>
                          <p className="text-xs text-muted-foreground">
                            {probabilityLabels[4 - rowIdx]} × {impactLabels[colIdx]}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))
                )}
              </div>
              
              {/* X-axis labels */}
              <div className="grid grid-cols-5 gap-1 mt-2">
                {impactLabels.map((label) => (
                  <span key={label} className="text-xs text-muted-foreground text-center">
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground text-center mt-2">
                Impact →
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-500" />
              <span className="text-sm">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-500" />
              <span className="text-sm">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-orange-500" />
              <span className="text-sm">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-destructive" />
              <span className="text-sm">Critical Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cell Details Dialog */}
      <Dialog open={!!selectedCell} onOpenChange={(open) => !open && setSelectedCell(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Items in Risk Category
              <Badge variant="outline">
                {selectedCell?.items.length || 0} items
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedCell?.items.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                      <Badge variant={item.type === 'event' ? 'default' : 'secondary'}>
                        {item.type === 'event' ? 'Event' : 'Incident'}
                      </Badge>
                      <StatusBadge variant={item.status as any} />
                    </div>
                    <p className="font-medium text-sm">{item.title}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
