import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryProps {
    summary: string;
}

export function ConversationSummaryCard({ summary }: SummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>خلاصه و تحلیل کلی مکالمه</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Using whitespace-pre-wrap to respect newlines in the summary text */}
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
      </CardContent>
    </Card>
  );
}
