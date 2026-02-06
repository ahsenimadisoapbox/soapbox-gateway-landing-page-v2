import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { GitBranch, Zap, Bell, Mail, Calendar } from "lucide-react";

const Workflow = () => {
  const workflows = [
    {
      id: 1,
      name: "Auto-assign CAPA Owner",
      trigger: "CAPA Creation",
      description:
        "Automatically assigns CAPA owner based on department and category",
      status: "active",
      executionCount: 45,
    },
    {
      id: 2,
      name: "Due Date Reminder",
      trigger: "3 Days Before Due",
      description: "Sends email reminder to CAPA owner and action owners",
      status: "active",
      executionCount: 128,
    },
    {
      id: 3,
      name: "Escalation to Manager",
      trigger: "Overdue Status",
      description:
        "Escalates overdue CAPAs to EHS Manager with notification",
      status: "active",
      executionCount: 12,
    },
    {
      id: 4,
      name: "Action Completion Notification",
      trigger: "Action Marked Complete",
      description: "Notifies CAPA owner when all actions are completed",
      status: "active",
      executionCount: 67,
    },
    {
      id: 5,
      name: "Effectiveness Review Reminder",
      trigger: "30 Days After Closure",
      description:
        "Schedules effectiveness review 30 days after CAPA closure",
      status: "active",
      executionCount: 23,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CAPA Automation Workflow</h1>
          <p className="text-muted-foreground">
            Automated workflows for streamlined CAPA management
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Workflows
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <p className="text-xs text-muted-foreground">
                Automating CAPA processes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Executions
              </CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workflows.reduce((sum, w) => sum + w.executionCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notifications Sent
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                Automated alerts
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Automation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge variant="outline" className="bg-success text-white">
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Trigger: {workflow.trigger}
                      </span>
                      <span>
                        Executions: {workflow.executionCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-lg bg-primary flex items-center justify-center mb-2">
                    <span className="text-primary-foreground font-bold">
                      CAPA
                      <br />
                      Initiation
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Start</p>
                </div>

                <div className="flex-1 h-0.5 bg-primary mx-4"></div>

                <div className="text-center">
                  <div className="w-32 h-32 rounded-lg bg-accent flex items-center justify-center mb-2">
                    <span className="text-accent-foreground font-bold">
                      Root Cause
                      <br />
                      Analysis
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Investigate</p>
                </div>

                <div className="flex-1 h-0.5 bg-primary mx-4"></div>

                <div className="text-center">
                  <div className="w-32 h-32 rounded-lg bg-warning flex items-center justify-center mb-2">
                    <span className="text-warning-foreground font-bold">
                      Action
                      <br />
                      Assignment
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                </div>

                <div className="flex-1 h-0.5 bg-primary mx-4"></div>

                <div className="text-center">
                  <div className="w-32 h-32 rounded-lg bg-info flex items-center justify-center mb-2">
                    <span className="text-info-foreground font-bold">
                      Execution
                      <br />& Monitor
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Execute</p>
                </div>

                <div className="flex-1 h-0.5 bg-primary mx-4"></div>

                <div className="text-center">
                  <div className="w-32 h-32 rounded-lg bg-success flex items-center justify-center mb-2">
                    <span className="text-success-foreground font-bold">
                      Validation
                      <br />& Closure
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Workflow;
