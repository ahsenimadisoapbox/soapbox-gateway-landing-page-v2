import { FileQuestion } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            This page is under construction
          </p>
          <p className="text-sm text-muted-foreground">
            Content will be available soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
