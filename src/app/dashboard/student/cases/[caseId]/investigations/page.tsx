'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrCreateCaseAttempt, getScoresOfCaseAttempt } from '@/lib/actions/case.actions';
import { CaseAttemptData } from '@/types/case-attempt';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';

// Page-specific Components
import { ScoreRadarChart, ChartData } from './_components/ScoreRadarChart';
import { ObjectiveChecklist } from './_components/ObjectiveChecklist';
import { OverallScoreCard } from './_components/OverallScoreCard';
import { FeedbackCard } from './_components/FeedbackCard';
import { EhrAccuracyReportCard } from './_components/EhrAccuracyReportCard';
import { WrittenHistoryCard } from './_components/WrittenHistoryCard';


// Mapping for section titles used in the radar chart
const sectionTitles: Record<string, string> = {
  chiefComplaint: 'شکایت اصلی',
  presentIllness: 'بیماری فعلی',
  pastMedicalHistory: 'سابقه پزشکی',
  drugHistory: 'سابقه دارویی',
  socialHistory: 'سابقه اجتماعی',
  familyHistory: 'سابقه خانوادگی',
  allergies: 'آلرژی‌ها',
  reviewOfSystems: 'مرور سیستم‌ها',
};


export default function EvaluationResultPage() {
    const params = useParams();
    const router = useRouter();
    const caseId = params.caseId as string;

    // Centralized state for data, loading, and error handling
    const [caseData, setCaseData] = useState<CaseAttemptData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  // Effect to fetch and process data
  useEffect(() => {
    const fetchData = async () => {
      if (!caseId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const atempt = await getOrCreateCaseAttempt(caseId)
        if (!atempt.data?.attemptId) throw new Error()
        
        const result = await getScoresOfCaseAttempt(atempt.data.attemptId)
        if (!result.data) throw new Error()
        const scoresResult = {success: true, data: result.data}

        if (!scoresResult.success || !scoresResult.data) {
          throw new Error("Failed to fetch evaluation scores.");
        }

        // Placeholder for written history as it's not in the sample JSON
        const placeholderWrittenHistory = {
            chiefComplaint: "درد قفسه سینه از 3 ماه قبل",
            presentIllness: "بیمار آقای 65 ساله‌ای است که با شکایت درد فشارنده در مرکز قفسه سینه مراجعه کرده است...",
            pastMedicalHistory: "سابقه فشار خون و چربی خون بالا از 10 سال قبل.",
            drugHistory: "لیزینوپریل 10mg، آتورواستاتین 20mg.",
            socialHistory: "سابقا سیگاری بوده.",
            familyHistory: "پدر سابقه سکته قلبی داشته است.",
            allergies: "ندارد.",
            reviewOfSystems: "تنگی نفس دارد."
        };

        // @ts-expect-error json value to object
        setCaseData({
          ...scoresResult.data,
          writtenHistory: placeholderWrittenHistory,
        } as CaseAttemptData);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [caseId]);

  // Memoized calculation for chart data to prevent re-rendering
  const chartData = useMemo<ChartData[]>(() => {
    if (!caseData) return [];
    
    // We use the EHR sections for the radar chart and normalize scores to a 0-10 scale for better comparison.
    return caseData.ehr_accuracy_report.sections.map(section => ({
      category: sectionTitles[section.section_name] || section.section_name,
      score: (section.score / section.max_points) * 10,
      fullMark: 10,
    }));
  }, [caseData]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">در حال بارگذاری گزارش...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>خطا در بارگذاری اطلاعات</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
      </div>
    );
  }

  // No Data State
  if (!caseData) {
    return <div className="text-center py-20">اطلاعاتی برای نمایش وجود ندارد.</div>;
  }

  // Main component render
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">گزارش بازخورد کیس بالینی</h1>
          <p className="text-muted-foreground mt-1">بیمار با شکایت: {caseData.writtenHistory.chiefComplaint}</p>
        </div>
        <Button onClick={() => router.push('/dashboard')}>بازگشت به داشبورد</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          <OverallScoreCard 
            score={caseData.ehr_accuracy_report.final_score.total_score}
            maxScore={caseData.ehr_accuracy_report.final_score.max_total_score}
          />
          
          <EhrAccuracyReportCard report={caseData.ehr_accuracy_report} />

          <WrittenHistoryCard history={caseData.writtenHistory} />
          
          <FeedbackCard 
            title="تکنیک مصاحبه" 
            score={caseData.conversation_summary_report.questioning_technique.score} 
            feedback={caseData.conversation_summary_report.questioning_technique.feedback} 
          />
          <FeedbackCard 
            title="مهارت‌های بین فردی و ارتباطی" 
            score={caseData.conversation_summary_report.interpersonal_skills.score} 
            feedback={caseData.conversation_summary_report.interpersonal_skills.feedback} 
          />
        </div>

        {/* Right Column (Summary & Checklist) */}
        <div className="space-y-8 lg:sticky lg:top-8">
          <Card>
            <CardHeader>
              <CardTitle>امتیاز در بخش‌های مختلف</CardTitle>
              <CardDescription>نمای کلی عملکرد شما در ثبت EHR</CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreRadarChart data={chartData} />
            </CardContent>
          </Card>

          <ObjectiveChecklist objectives={caseData.conversation_summary_report.learning_objectives} />
        </div>
      </div>
    </div>
  );
}
