export const allCases = {
  cardiology: {
    name: 'قلب و عروق',
    cases: [
      {
        id: 'case-001',
        title: 'بیمار ۵۸ ساله با درد قفسه سینه',
        hiddenDetails: {
          historyOfPresentIllness: 'The pain started 2 hours ago while resting. It is a 7/10 intensity. Associated with sweating and nausea.',
          pastMedicalHistory: 'Hypertension, diagnosed 5 years ago. Non-compliant with medication.',
          socialHistory: 'Smokes 1 pack of cigarettes per day for 30 years.',
          physicalExam: {
            vitals: 'BP 160/95 mmHg, HR 110 bpm, RR 22/min, Temp 37.0°C, SpO2 95% on room air.',
            heart: 'Tachycardic rhythm. S1, S2 heard. No murmurs, but an S4 gallop is present. JVP is not elevated.',
            lungs: 'Clear to auscultation bilaterally. No wheezes or rales.',
            extremities: 'No peripheral edema. Pulses are 2+ and symmetric.'
          }
        }
      },
    ],
  },
  'internal-medicine': {
    name: 'داخلی',
    cases: [
      {
        id: 'case-003',
        title: 'بیمار ۴۵ ساله با خستگی و پرنوشی',
        chiefComplaint: 'احساس خستگی مزمن، افزایش تشنگی و تکرر ادرار.',
        learningObjectives: ['تشخیص و مدیریت دیابت نوع ۲', 'توصیه‌های سبک زندگی'],
        hiddenDetails: {
          historyOfPresentIllness: 'Symptoms have been worsening over the last 3 months. Has gained 10kg in the last year. Reports blurred vision occasionally.',
          familyHistory: 'Father and older sister both have Type 2 Diabetes.',
        }
      },
    ],
  },
  neurology: {
    name: 'مغز و اعصاب',
    cases: [
      {
        id: 'case-004',
        title: 'بیمار ۲۸ ساله با سردرد ضربان‌دار',
        chiefComplaint: 'سردردهای یک‌طرفه و شدید همراه با تهوع و ترس از نور.',
        learningObjectives: ['تشخیص میگرن', 'مدیریت حملات حاد میگرن'],
        hiddenDetails: {
          historyOfPresentIllness: 'Headaches occur 2-3 times per month, lasting 4-6 hours. Preceded by seeing flashing lights (aura).',
          triggers: 'Stress and lack of sleep seem to trigger the headaches.',
        }
      },
    ],
  },
};


// Helper function to get basic details for the UI
export const getCaseDetails = (caseId: string) => {
    for (const specialty in allCases) {
      const foundCase = allCases[specialty as keyof typeof allCases].cases.find(c => c.id === caseId);
      if (foundCase) {
        // This would be your `User` model from Prisma
        return {
            name: "بیمار مجازی",
            age: parseInt(foundCase.title.match(/\d+/)?.[0] || '50'),
            avatarUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${caseId}`,
            gender: "نامشخص", // You could add this to your case data
        };
      }
    }
    return null;
}

