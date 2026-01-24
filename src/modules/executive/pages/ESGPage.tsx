import React from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { ProgressBar } from '../components/shared/StatusBadge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Leaf, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { esgMetrics } from '../data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const emissionsTrendData = [
  { month: 'Jan', emissions: 95 },
  { month: 'Feb', emissions: 92 },
  { month: 'Mar', emissions: 90 },
  { month: 'Apr', emissions: 88 },
  { month: 'May', emissions: 87 },
  { month: 'Jun', emissions: 85 },
  { month: 'Jul', emissions: 86 },
  { month: 'Aug', emissions: 84 },
  { month: 'Sep', emissions: 83 },
  { month: 'Oct', emissions: 82 },
  { month: 'Nov', emissions: 80 },
  { month: 'Dec', emissions: 78 },
];

const esgRadarData = [
  { subject: 'Carbon', A: 85, fullMark: 100 },
  { subject: 'Waste', A: 96, fullMark: 100 },
  { subject: 'Water', A: 80, fullMark: 100 },
  { subject: 'Safety', A: 92, fullMark: 100 },
  { subject: 'Training', A: 92, fullMark: 100 },
  { subject: 'Governance', A: 98, fullMark: 100 },
];

const ESGPage = () => {
  const environmentalMetrics = esgMetrics.filter(m => m.category === 'environmental');
  const socialMetrics = esgMetrics.filter(m => m.category === 'social');
  const governanceMetrics = esgMetrics.filter(m => m.category === 'governance');

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Leaf className="h-6 w-6 text-accent" />
              ESG & Sustainability Oversight
            </h1>
            <p className="text-muted-foreground mt-1">Environmental, Social, and Governance performance - Board Ready</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export ESG Report
            </Button>
          </div>
        </div>

        {/* ESG Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
            <p className="text-sm text-muted-foreground">Overall ESG Rating</p>
            <p className="text-5xl font-bold text-accent mt-2">B+</p>
            <p className="text-sm text-success flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4" /> Up from B
            </p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Environmental Score</p>
            <p className="text-4xl font-bold mt-2">82</p>
            <ProgressBar value={82} showValue={false} colorClass="bg-success" className="mt-3" />
          </div>
          <div className="p-6 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Social Score</p>
            <p className="text-4xl font-bold mt-2">88</p>
            <ProgressBar value={88} showValue={false} colorClass="bg-info" className="mt-3" />
          </div>
          <div className="p-6 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Governance Score</p>
            <p className="text-4xl font-bold mt-2">96</p>
            <ProgressBar value={96} showValue={false} colorClass="bg-chart-4" className="mt-3" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExecutivePanel title="ESG Performance Radar">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={esgRadarData}>
                      <PolarGrid className="stroke-border" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="A" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </ExecutivePanel>

              <ExecutivePanel title="Carbon Emissions Trend (12 months)">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emissionsTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="emissions" 
                        name="Emissions (tons CO2e)" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--accent))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-sm text-success mt-2">↓ 18% reduction year-over-year</p>
              </ExecutivePanel>
            </div>
          </TabsContent>

          <TabsContent value="environmental">
            <ExecutivePanel title="Environmental Metrics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {environmentalMetrics.map((metric, index) => (
                  <div key={index} className="p-6 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <div className="flex items-end gap-2 mt-2">
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground mb-1">{metric.unit}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-muted-foreground">Target: {metric.target} {metric.unit}</span>
                      <span className={`text-sm flex items-center gap-1 ${
                        metric.trend === 'down' ? 'text-success' : metric.trend === 'up' ? 'text-warning' : 'text-muted-foreground'
                      }`}>
                        {metric.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                        {metric.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                        {metric.trend === 'down' ? 'Improving' : metric.trend === 'up' ? 'Needs attention' : 'Stable'}
                      </span>
                    </div>
                    <ProgressBar 
                      value={(metric.value / metric.target) * 100} 
                      showValue={false}
                      colorClass={metric.value <= metric.target ? 'bg-success' : 'bg-warning'}
                      className="mt-3"
                    />
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="social">
            <ExecutivePanel title="Social Metrics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {socialMetrics.map((metric, index) => (
                  <div key={index} className="p-6 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <div className="flex items-end gap-2 mt-2">
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground mb-1">{metric.unit}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-muted-foreground">Target: {metric.target} {metric.unit}</span>
                      <span className={`text-sm flex items-center gap-1 ${
                        (metric.name === 'LTIR' ? metric.trend === 'down' : metric.trend === 'up') ? 'text-success' : 'text-warning'
                      }`}>
                        {metric.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                        {metric.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                        {(metric.name === 'LTIR' ? metric.trend === 'down' : metric.trend === 'up') ? 'Improving' : 'Needs attention'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="governance">
            <ExecutivePanel title="Governance Metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {governanceMetrics.map((metric, index) => (
                  <div key={index} className="p-6 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{metric.name}</p>
                      <span className={`text-sm ${metric.value >= metric.target ? 'text-success' : 'text-warning'}`}>
                        {metric.value >= metric.target ? '✓ On Target' : 'Below Target'}
                      </span>
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                      <p className="text-4xl font-bold">{metric.value}{metric.unit}</p>
                    </div>
                    <ProgressBar 
                      value={metric.value} 
                      showValue={false}
                      colorClass={metric.value >= metric.target ? 'bg-success' : 'bg-warning'}
                      className="mt-4"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Target: {metric.target}{metric.unit}</p>
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ESGPage;
