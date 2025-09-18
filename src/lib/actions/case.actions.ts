'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { getPatientResponse } from './patient.actions';
import { ChatMessage } from '@prisma/client';
import { getGenerativeModel } from '../services/gemini';
import { prompts } from '../prompts';
import { createCaseSchema, writtenHistorySchema } from '../validations';
import { z } from 'zod';
import { db } from '../db';
import { JsonObject } from '@prisma/client/runtime/library';

// Define a type for the chat history to be used on the client.
export type ChatHistory = {
  attemptId: string;
  messages: Pick<ChatMessage, 'role' | 'content' | 'emotional_states'>[];
  writtenHistory: object
};

/**
 * Fetches an existing case attempt or creates a new one if none exists.
 * @param caseId The ID of the case.
 * @returns The attempt ID and its message history.
 */
export async function getOrCreateCaseAttempt(
  caseId: string
): Promise<{
  success: boolean;
  data?: ChatHistory;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'User not authenticated.' };
  }
  const userId = session.user.id;

  try {
    let attempt = await db.caseAttempt.findUnique({
      where: { userId_caseId: { userId, caseId } },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!attempt) {
      attempt = await db.caseAttempt.create({
        data: {
          userId,
          caseId,
          status: 'IN_PROGRESS',
        },
        include: { messages: true },
      });
    }

    return {
      success: true,
      data: {
        attemptId: attempt.id,
        messages: attempt.messages.map(({ role, content, emotional_states }) => ({
          role,
          content,
          emotional_states,
        })),
        writtenHistory: attempt.writtenHistory as unknown as object
      },
    };
  } catch (error) {
    console.error('Error getting or creating case attempt:', error);
    return { success: false, error: 'Database operation failed.' };
  }
}



/**
 * Posts a user's message to a case, gets the AI response, and saves both.
 * @param attemptId The ID of the current case attempt.
 * @param userMessage The text of the user's message.
 * @returns The AI's response message.
 */
export async function postMessageToCase(
  attemptId: string,
  userMessage: string
): Promise<{
  success: boolean;
  data?: {
    dialogue: string;
    emotional_state: string;
  };
  error?: string;
}> {
  try {
    // 1. Save the user's message to the database.
    await db.chatMessage.create({
      data: {
        attemptId,
        role: "USER",
        content: userMessage,
        emotional_states: null
      },
    });

    // 2. Get the AI's response.
    const aiResponseResult = await getPatientResponse(attemptId);
    console.log(aiResponseResult)
    if (!aiResponseResult.success || !aiResponseResult.data) {
      throw new Error(aiResponseResult.error || "Failed to get AI response.");
    }
    const aiMessage = aiResponseResult.data.dialogue;
    const sp_state = aiResponseResult.data.emotional_state;

    // 3. Save the AI's message to the database.
    await db.chatMessage.create({
      data: {
        attemptId,
        role: "AI",
        content: aiMessage,
        emotional_states: sp_state,
      },
    });

    // Revalidate the path to ensure the UI updates with the new messages.
    revalidatePath(`/dashboard/students/cases/`); // A broader revalidation can be safer.
    return { success: true, data: aiResponseResult.data };
  } catch (error) {
    console.error("Error posting message:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get case's first emotional state for launching case.
 * @param caseId The ID of the current case.
 * @returns The case's state as string.
 */
export async function getCaseEmotionalState(
  caseId: string
): Promise<{ success: boolean; data?: { state: string }; error?: string }> {
  try {
    const patient = await db.case.findUnique({where:{id: caseId}, select: {systemPrompt: true}},)
    if (!patient) throw new Error('No case founded.')
    const state = (patient.systemPrompt as JsonObject).emotional_state

    if (typeof(state) !== 'string') throw new Error('No state founded')
    
    return { success: true, data: {state} }
  } catch (error) {
    console.error('Error getting case progress:', error);
    return { success: false, error: (error as Error).message };
  }
}


/**
 * NEW: Handles a physical examination request.
 * It logs the request, gets a response from the AI, and returns it.
 */
export async function getPhysicalExaminationResponse(
  attemptId: string,
  category: string,
  request: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    // 1. Fetch the case attempt to get the physical exam findings.
    const attempt = await db.caseAttempt.findUnique({
      where: { id: attemptId },
      include: { case: { select: { physicalExamFindings: true } } },
    });

    if (!attempt?.case?.physicalExamFindings) {
      throw new Error('Case or examination findings not found.');
    }

    // 2. Get the AI model and prepare the prompt.
    const model = getGenerativeModel();
    const systemPrompt = prompts.physicalExamination.getFinding(
      attempt.case.physicalExamFindings,
      request
    );

    // 3. Call the AI.
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // 4. Save the request and response to the database for logging.
    await db.physicalExaminationRequest.create({
      data: {
        attemptId,
        category,
        request,
        response: responseText,
      },
    });

    return { success: true, data: responseText };
  } catch (error) {
    console.error('Error in getPhysicalExaminationResponse:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Submits the user's written history, saves it, and gets AI-powered scoring.
 */
export async function submitAndScoreWrittenHistory(
  attemptId: string,
  values: z.infer<typeof writtenHistorySchema>
): Promise<{ success: boolean, data?: { score: number, feedback: string }, error?: string }> {
  try {
    // 1. Validate input data using Zod schema.
    const validatedData = writtenHistorySchema.parse(values);

    
    // 3. Save the user's submission to the database.
    // We use Prisma.JsonNull to handle potentially undefined optional fields.
    await db.caseAttempt.update({
      where: { id: attemptId },
      data: {
        writtenHistory: {
          chiefComplaint: validatedData.chiefComplaint,
          presentIllness: validatedData.presentIllness,
          pastMedicalHistory: validatedData.pastMedicalHistory || null,
          drugHistory: validatedData.drugHistory || null,
          socialHistory: validatedData.socialHistory || null,
          familyHistory: validatedData.familyHistory || null,
          allergies: validatedData.allergies || null,
          reviewOfSystems: validatedData.reviewOfSystems || null,
        },
      },
    });
    const attempt = await db.caseAttempt.findUnique({
      where: { id: attemptId },
      include: {case: true}
    });
    if (!attempt) return { success: false, error: "Validation is not set yet." };
    
    // 4. Prepare the prompt for the AI.
    const model = getGenerativeModel();
    const scoringPrompt = prompts.scoreWrittenHistory.evaluate(
      JSON.stringify(validatedData, null, 2),
      JSON.stringify(attempt.case.systemPrompt)
    );

    // 5. Call the AI and parse the JSON response.
    const result = await model.generateContent(scoringPrompt);
    const responseText = result.response.text();
    const parsedResult = JSON.parse(responseText).ehr_accuracy_report as object;

    // 6. Save the score and feedback to the database.
    await db.caseAttempt.update({
      where: { id: attemptId },
      data: {
        ehr_accuracy_report: parsedResult
      },
    });

    // @ts-expect-error lazy to type the object
    const scores = parsedResult.final_score
    return { success: true, data: {score: scores.total_score, feedback: `${scores.total_score} / ${scores.max_total_score}`} };
  } catch (error) {
    console.error('Error submitting written history:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data format.' };
    }
    return { success: false, error: (error as Error).message };
  }
}

/**
 * gets AI-powered scoring for chat messages.
 */
export async function getConversationScoring(
  attemptId: string,
): Promise<{ success: boolean, data?: { score: number, feedback: string }, error?: string }> {
  try {

    const attempt = await db.caseAttempt.findUnique({
      where: { id: attemptId },
      include: {case: true, messages: true}
    });
    if (!attempt) return { success: false, error: "Validation is not set yet." };

    const conversation = attempt.messages.map((msg) => {return {role: msg.role === 'AI' ? 'بیمار' : 'دانشجو' , dialogue: msg.content}})
    // @ts-expect-error Too lazy to type the object
    const objectives = (attempt.case.learningObjectives as object[]).map((itm) => {return {id: itm.id, text: itm.statement, weight: itm.score}})
    
    // 4. Prepare the prompt for the AI.
    const model = getGenerativeModel();
    const scoringPrompt = prompts.scoreConversation.evaluate(
      JSON.stringify(conversation),
      JSON.stringify(objectives)
    );


    // 5. Call the AI and parse the JSON response.
    const result = await model.generateContent(scoringPrompt);
    const responseText = result.response.text();
    const parsedResult = JSON.parse(responseText).evaluation_summary as object;

    // 6. Save the score and feedback to the database.
    await db.caseAttempt.update({
      where: { id: attemptId },
      data: {
        conversation_summary_report: parsedResult
      },
    });

    // @ts-expect-error lazy to type the object
    const scores = parsedResult.learning_objectives
    return { success: true, data: {score: scores.score, feedback: `${scores.score} / ${scores.max_score}`} };
  } catch (error) {
    console.error('Error submitting written history:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data format.' };
    }
    return { success: false, error: (error as Error).message };
  }
}


/**
 * Fetches the user's progress for a given case to initialize the stepper.
 */
export async function getCaseProgress(
  caseId: string
): Promise<{ success: boolean; data?: { highestCompletedStep: number }; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true, data: { highestCompletedStep: -1 } };
    }
    const userId = session.user.id;

    const attempt = await db.caseAttempt.findUnique({
      where: { userId_caseId: { userId, caseId } },
      select: {
        conversation_summary_report: true,
        ehr_accuracy_report: true,
        messages: { take: 1 },
        examinationRequests: { take: 1 },
      },
    });

    if (!attempt) {
      return { success: true, data: { highestCompletedStep: -1 } };
    }

    if (attempt.ehr_accuracy_report !== null) {
      return { success: true, data: { highestCompletedStep: 1 } };
    }

    if (attempt.conversation_summary_report !== null) {
      return { success: true, data: { highestCompletedStep: 0 } };
    }

    if (attempt.messages.length > 0 || attempt.examinationRequests.length > 0) {
      return { success: true, data: { highestCompletedStep: 0 } };
    }

    return { success: true, data: { highestCompletedStep: -1 } };
  } catch (error) {
    console.error('Error getting case progress:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Define the type for the server action's return value for better type safety on the client
type FormState = {
  success: boolean;
  message: string;
  caseId?: string;
};

export async function createCaseAction(
  values: z.infer<typeof createCaseSchema>
): Promise<FormState> {
  // 1. Authorization: Ensure the user is an admin
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Unauthorized: You must be an admin to perform this action.',
    };
  }

  // 2. Validation: This is a secondary check, as the form should have already validated
  const validatedFields = createCaseSchema.safeParse(values);
  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }
  
  const { 
    systemPrompt, 
    keywords, 
    learningObjectives, 
    differentialDiagnosis,
    emotional_state,
    ...restOfData 
  } = validatedFields.data;

  const sp = {emotional_state, ...systemPrompt}
  try {
    // 3. Database Operation: Create the case
    const newCase = await db.case.create({
      data: {
        ...restOfData,
        // Transform arrays of objects like {value: 'text'} into simple string arrays
        keywords: keywords.map(kw => kw.value),
        differentialDiagnosis: differentialDiagnosis.map(ddx => ddx.value),
        
        // The systemPrompt object is already in the correct format for a JSON field
        systemPrompt: sp,

        // The learningObjectives are already in the correct format for a JSON field
        learningObjectives,
        
        // Associate the case with the logged-in admin user
        authorId: session.user.id,
      },
    });

    // 4. Cache Revalidation: Invalidate cache for case list pages
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: 'کیس با موفقیت ساخته شد!',
      caseId: newCase.id,
    };
  } catch (error) {
    console.error('Error creating case:', error);
    return {
      success: false,
      message: 'خطای پایگاه داده: ساخت کیس با مشکل مواجه شد.',
    };
  }
}

/**
 * Server action to fetch all clinical cases.
 */
export async function getAllCases() {
  try {
    const cases = await db.case.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    });
    return cases;
  } catch (error) {
    console.error("Error fetching cases:", error);
    return [];
  }
}


/**
 * Server action to fetch Case attempt evaluation scores.
 */
export async function getScoresOfCaseAttempt(caseId: string) {
  try {
    const session = await auth()
    const attempt = await db.caseAttempt.findUnique({
      where: {id:caseId },
      omit: {createdAt: true, updatedAt: true,}
    });
    if (!attempt) throw new Error("404")
    
    if (session?.user.id !== attempt.userId) throw new Error("404")

    return {success: true, data: attempt};
  } catch (error) {
    console.error("Error fetching attempt:", error);
    return {success: false, error: "failed to load attempt"};
  }
}