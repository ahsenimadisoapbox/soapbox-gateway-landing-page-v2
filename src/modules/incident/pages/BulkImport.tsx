import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Upload, Download, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ImportResult {
  row: number;
  status: "success" | "error" | "warning";
  message: string;
  data?: any;
}

export default function BulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults([]);
      setProgress(0);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    setImporting(true);
    setProgress(0);

    // Simulate import process
    const mockResults: ImportResult[] = [
      {
        row: 1,
        status: "success",
        message: "Incident imported successfully",
        data: { id: "INC-2024-006", title: "Network Outage" }
      },
      {
        row: 2,
        status: "success",
        message: "Incident imported successfully",
        data: { id: "INC-2024-007", title: "Equipment Failure" }
      },
      {
        row: 3,
        status: "warning",
        message: "Incident imported with warnings - missing optional field 'site'",
        data: { id: "INC-2024-008", title: "Access Control Issue" }
      },
      {
        row: 4,
        status: "error",
        message: "Failed to import - invalid severity value",
        data: null
      },
      {
        row: 5,
        status: "success",
        message: "Incident imported successfully",
        data: { id: "INC-2024-009", title: "Safety Inspection" }
      },
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          setResults(mockResults);
          
          const successCount = mockResults.filter(r => r.status === "success").length;
          const errorCount = mockResults.filter(r => r.status === "error").length;
          const warningCount = mockResults.filter(r => r.status === "warning").length;

          toast.success("Import completed", {
            description: `${successCount} succeeded, ${errorCount} failed, ${warningCount} warnings`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownloadTemplate = () => {
    toast.success("Downloading template...", {
      description: "CSV template will download shortly",
    });
  };

  const successCount = results.filter(r => r.status === "success").length;
  const errorCount = results.filter(r => r.status === "error").length;
  const warningCount = results.filter(r => r.status === "warning").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bulk Import</h1>
        <p className="text-muted-foreground">Import multiple incidents from CSV or Excel files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Upload File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please ensure your file follows the template format. Download the template below to get started.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Select File</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={importing}
                />
                <Button
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  disabled={importing}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Template
                </Button>
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? "Importing..." : "Start Import"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Successful</span>
                </div>
                <span className="font-semibold text-success">{successCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm">Warnings</span>
                </div>
                <span className="font-semibold text-warning">{warningCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Failed</span>
                </div>
                <span className="font-semibold text-destructive">{errorCount}</span>
              </div>
            </div>

            {results.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Total rows processed: {results.length}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Incident ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.row}>
                    <TableCell className="font-medium">{result.row}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {result.status === "success" && <CheckCircle className="h-4 w-4 text-success" />}
                        {result.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                        {result.status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                        <span className={
                          result.status === "success" ? "text-success" :
                          result.status === "warning" ? "text-warning" :
                          "text-destructive"
                        }>
                          {result.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{result.message}</TableCell>
                    <TableCell className="font-medium">{result.data?.id || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
