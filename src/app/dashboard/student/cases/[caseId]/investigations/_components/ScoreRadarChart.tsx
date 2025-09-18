'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface ChartData {
  category: string;
  score: number; // Represents the normalized score
  fullMark: number;
}

export function ScoreRadarChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
        <Radar 
            name="امتیاز شما (از 10)" 
            dataKey="score" 
            stroke="var(--primary)" 
            fill="var(--primary)" 
            fillOpacity={0.6} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
