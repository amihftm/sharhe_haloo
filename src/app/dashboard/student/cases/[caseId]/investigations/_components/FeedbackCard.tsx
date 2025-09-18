import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeedbackProps {
    title: string;
    score: number;
    feedback: string;
}

export function FeedbackCard({ title, score, feedback }: FeedbackProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Badge variant="outline" className="shrink-0">امتیاز: {score}/10</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{feedback}</p>
      </CardContent>
    </Card>
  );
}
