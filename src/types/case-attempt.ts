// This file centralizes all the TypeScript types related to the case attempt data.
// Using a central type definition file makes your project easier to maintain and scale.

/**
 * Represents a single section of the EHR (Electronic Health Record) accuracy report.
 */
export interface EhrReportSection {
  section_name: string;
  score: number;
  max_points: number;
  justification: string;
}

/**
 * Represents the entire EHR accuracy report, including all sections and the final score.
 */
export interface EhrAccuracyReport {
  sections: EhrReportSection[];
  final_score: {
    total_score: number;
    max_total_score: number;
  };
}

/**
 * Represents the learning objectives section of the conversation summary.
 */
export interface LearningObjectives {
  score: number;
  max_score: number;
  achieved_items: string[];
  missed_items: string[];
}

/**
 * Represents a feedback item with a score and a textual comment.
 */
export interface Feedback {
  score: number;
  feedback: string;
}

/**
 * Represents the conversation summary report, including learning objectives and skill feedback.
 */
export interface ConversationSummaryReport {
  learning_objectives: LearningObjectives;
  questioning_technique: Feedback;
  interpersonal_skills: Feedback;
}

/**
 * Represents the student's written history for the case.
 * NOTE: This data was not in your sample JSON, so its structure is inferred from your original page.tsx.
 */
export interface WrittenHistory {
  chiefComplaint: string;
  presentIllness: string;
  pastMedicalHistory: string;
  drugHistory: string;
  socialHistory: string;
  familyHistory: string;
  allergies: string;
  reviewOfSystems: string;
}

/**
 * Represents the complete data structure for a case attempt evaluation.
 */
export interface CaseAttemptData {
  ehr_accuracy_report: EhrAccuracyReport;
  conversation_summary_report: ConversationSummaryReport;
  writtenHistory: WrittenHistory; // Added based on original UI needs
}
