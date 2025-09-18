import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OverallScoreCardProps {
  score: number;
  maxScore: number;
}

export function OverallScoreCard({ score, maxScore }: OverallScoreCardProps) {
  // Calculate percentage based on actual score and max score
  const scorePercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>امتیاز نهایی شما (از دقت EHR)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-lg text-muted-foreground">/ {maxScore}</span>
        </div>
        <Progress value={scorePercentage} className="w-full" />
      </CardContent>
    </Card>
  );
}
