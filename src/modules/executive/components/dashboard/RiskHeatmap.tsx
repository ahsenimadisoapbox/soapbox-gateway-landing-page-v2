import React from 'react';
import { cn } from '../../lib/utils';

interface RiskHeatmapProps {
  className?: string;
}

interface HeatmapCell {
  likelihood: number;
  impact: number;
  count: number;
  risks: string[];
}

const mockHeatmapData: HeatmapCell[] = [
  { likelihood: 1, impact: 5, count: 0, risks: [] },
  { likelihood: 2, impact: 5, count: 2, risks: ['Data Privacy Breach', 'Environmental Spill'] },
  { likelihood: 3, impact: 5, count: 0, risks: [] },
  { likelihood: 4, impact: 5, count: 1, risks: ['Regulatory Non-Compliance'] },
  { likelihood: 5, impact: 5, count: 0, risks: [] },
  { likelihood: 1, impact: 4, count: 0, risks: [] },
  { likelihood: 2, impact: 4, count: 0, risks: [] },
  { likelihood: 3, impact: 4, count: 1, risks: ['Contractor Safety Exposure'] },
  { likelihood: 4, impact: 4, count: 0, risks: [] },
  { likelihood: 5, impact: 4, count: 0, risks: [] },
  { likelihood: 1, impact: 3, count: 0, risks: [] },
  { likelihood: 2, impact: 3, count: 0, risks: [] },
  { likelihood: 3, impact: 3, count: 1, risks: ['Supplier Quality Drift'] },
  { likelihood: 4, impact: 3, count: 0, risks: [] },
  { likelihood: 5, impact: 3, count: 0, risks: [] },
  { likelihood: 1, impact: 2, count: 1, risks: ['Minor Process Gap'] },
  { likelihood: 2, impact: 2, count: 0, risks: [] },
  { likelihood: 3, impact: 2, count: 0, risks: [] },
  { likelihood: 4, impact: 2, count: 0, risks: [] },
  { likelihood: 5, impact: 2, count: 0, risks: [] },
  { likelihood: 1, impact: 1, count: 0, risks: [] },
  { likelihood: 2, impact: 1, count: 0, risks: [] },
  { likelihood: 3, impact: 1, count: 0, risks: [] },
  { likelihood: 4, impact: 1, count: 0, risks: [] },
  { likelihood: 5, impact: 1, count: 0, risks: [] },
];

const getCellColor = (likelihood: number, impact: number): string => {
  const score = likelihood * impact;
  if (score >= 20) return 'bg-destructive';
  if (score >= 12) return 'bg-warning';
  if (score >= 6) return 'bg-yellow-400';
  return 'bg-success';
};

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <div className="flex gap-2">
        {/* Y-axis label */}
        <div className="flex flex-col justify-between text-xs text-muted-foreground pr-2">
          <span>5</span>
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
        </div>
        
        {/* Heatmap grid */}
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1">
            {[5, 4, 3, 2, 1].map((impact) =>
              [1, 2, 3, 4, 5].map((likelihood) => {
                const cell = mockHeatmapData.find(
                  (c) => c.likelihood === likelihood && c.impact === impact
                );
                return (
                  <div
                    key={`${likelihood}-${impact}`}
                    className={cn(
                      "heatmap-cell aspect-square flex items-center justify-center text-xs font-medium",
                      getCellColor(likelihood, impact),
                      cell && cell.count > 0 ? 'text-white' : 'text-transparent'
                    )}
                    title={cell?.risks.join(', ') || 'No risks'}
                  >
                    {cell?.count || ''}
                  </div>
                );
              })
            )}
          </div>
          
          {/* X-axis label */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>
      
      {/* Axis labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">Impact ↑</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Likelihood →</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success" />
          <span className="text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-400" />
          <span className="text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-destructive" />
          <span className="text-muted-foreground">Critical</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
